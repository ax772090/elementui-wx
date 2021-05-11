const path = require('path');
// 被监听的目录
const templates = path.resolve(process.cwd(), './examples/pages/template');
// 监听工具
const chokidar = require('chokidar');
// watch方法监听tempalte目录 
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
  // 当目录下的文件发生变化时，开个进程运行npm run i18n
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
