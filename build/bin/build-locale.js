// 用于生成国际化文件
var fs = require('fs');
var save = require('file-save');
var resolve = require('path').resolve;
var basename = require('path').basename;
// 读取locale/lang下面的文件
var localePath = resolve(__dirname, '../../src/locale/lang');
var fileList = fs.readdirSync(localePath);

/**
 * 核心方法
 * @param {*} filename 文件名称带后缀
 * @param {*} name 文件名
 * @param {*} cb 回调函数
 */
var transform = function(filename, name, cb) {
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', {loose: true}]
    ],
    moduleId: name
  }, cb);
};

fileList
// 过滤出.js文件
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');//zh-CN/zh-TW

    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });
