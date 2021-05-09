// 用于生成packages/theme-chalk/src/index.scss
var fs = require('fs');
var path = require('path');
// 读取components.json文件
var Components = require('../../components.json');
var themes = [
  'theme-chalk',
];
Components = Object.keys(Components);//[pagination,dialog,...]
// packages的基础路径
var basepath = path.resolve(__dirname, '../../packages/');

// 文件是否存在
function fileExists(filePath) {
  try {
    console.log('wx',fs.statSync(filePath));
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
