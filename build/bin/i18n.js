'use strict';

var fs = require('fs');
var path = require('path');
// elementui官网默认提供了四种语言
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  // 如果没有这几个文件，就会抛出异常并且新建文件
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    // 模板文件路径
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    // 输出的.vue文件
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    // 1.读模板文件
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach(key => {
      // 2.替换模板文件里面的部分内容
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });
    // 3.写入到.vue文件中

    fs.writeFileSync(outputPath, content);
  });
});
