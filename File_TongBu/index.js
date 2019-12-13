var CocoConfig = require('./config');
 require('./public_js/common');
var wathchpath=CocoConfig.path;
var relationship=CocoConfig.relationship;
var Chokidar_filewatch = require('./Chokidar_filewatch');
Chokidar_filewatch.watch(wathchpath);  







  
          


