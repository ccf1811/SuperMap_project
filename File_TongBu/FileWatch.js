var fs = require("fs");
var csvParser = require('csv-parse');
var iconv = require('iconv-lite');  


function FileWatch(directoryPath) {
	var me=this;
	 me.directoryPath = directoryPath;
	 me.watchfile = function() {
	 	console.log('跟踪文件夹改动中...........');
		fs.watch(me.directoryPath, function(event, filename) {
			if(event!='change')return;
			if(filename) {
				console.log('filename provided: ' + filename);
				readExcel(filename);
			} else {
				console.log('filename not provided');
			}
		});
	}
	var readExcel=function(n){
		  fs.readFile(me.directoryPath+'/'+n, { encoding: 'utf-8' }, function(err, csvData) {
                if (err) 
                {
                    console.log(err);
                }
                    //var texts = iconv.decode(csvData, 'gbk');  
                  csvParser(csvData, { csvData: ',' }, function(err, data) {
                  	 if (err)
                    {
                        console.log(err);
                    } 
                    else 
                    {      
                    	 console.log(data); 
                    }
                  	
                  });
               
             });
		
	}
	
};
module.exports = FileWatch;