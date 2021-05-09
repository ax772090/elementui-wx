'use strict';

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
// 1.读取icon.scss文件
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
// 2.通过postcss转换文件内容,有点像css语法树
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

nodes.forEach((node) => {
  var selector = node.selector || ''; // node.selector: '.el-icon-first-aid-kit:before'
  var reg = new RegExp(/\.el-icon-([^:]+):before/);//[^:]查找不是:的字符
  var arr = selector.match(reg);// first-aid-kit  存放匹配结果的数组

  if (arr && arr[1]) {
    // 3.将icon名称存到classList中
    classList.push(arr[1]);
  }
});
console.log(classList);
// 倒序
classList.reverse(); // 希望按 css 文件顺序倒序排列
// 4.写入文件icon.json中，方便其他地方使用
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
