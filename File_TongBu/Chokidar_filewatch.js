/*
 作者:coco
 内容:监听本地某文件夹，将其中文件与Mysql数据库中表进行对应、同步更新。Mysql不做表删除，会备份上一次改动的文件
 注意：excel必须为csv形式utf-8编码，第一行为标题。格式需为utf-8格式。文件命名不能含有 - 空格
 思考:mysql执行语句中替换符？到底怎么用的哈？
 更新说明：1.第一次调试完毕程序 20191107
		  2.
          3.
*/
var chokidar = require('chokidar');
var mysql = require('mysql');
var fs = require('fs');
var csvParser = require('csv-parse');



//检查数据库中是否有此表 SELECT DISTINCT t.table_name, n.SCHEMA_NAME FROM information_schema.TABLES t, information_schema.SCHEMATA n WHERE t.table_name = 'armytable1' AND n.SCHEMA_NAME = 'fwq';
//表更名 RENAME TABLE 测试表1 TO 测试表2;
var sqlConfig={
		host: 'localhost',
		user: 'root',
		password: '123456',
		port: '3306',
		database: 'test'
}
var connection = mysql.createConnection(sqlConfig);

var watcher = null;
var ready = false;

var makeaddTablesql=function(dataTitle,f){
	
	var str="";
	for(var i=0;i<dataTitle.length;i++){
		var _str=dataTitle[i]+" VARCHAR(100) ,";
		str+=_str;
	}
	str=str.substring(0,str.length-1);
	var insertSQL="CREATE TABLE IF NOT EXISTS "+
	 f+
	" ( "+
	str+
	" ) DEFAULT CHARSET=utf8; "
	return insertSQL;
}

//根据表名和数据，在数据库中新建数据表，并且插入数据
var createTableAndInsertData=function(_fillname,data){
	//直接插入
	_fillname=checkTableName(_fillname);
		console.log(data);
		var dataTitle=data.shift();
		var _addNewTable_sql=makeaddTablesql(dataTitle,_fillname);
		console.log(_addNewTable_sql);
		 connection.query(_addNewTable_sql, [], (err,results,fields)=> {//新建表
			 if(err)console.log(err);
			 var insertSql = "INSERT INTO "+_fillname+" ("+dataTitle+") VALUES ?";
			   connection.query(insertSql, [data], (err,results,fields)=> {//插入数据
				    if(err)console.log(err);
			   });
		 });
	//	connection.end();
}

var checkTableName=function(_fillname){
	_fillname=_fillname.replace(/-/g,"_");//字符串替换 保证文件名正确
	_fillname=_fillname.replace(/ /g,"_");
	//_fillname=_fillname.replace(/(/g,"_");
	//_fillname=_fillname.replace(/)/g,"_");
	
	while(_fillname.indexOf('(')!=-1||_fillname.indexOf('（')!=-1){
		_fillname=_fillname.replace("(","_");
		_fillname=_fillname.replace(")","_");
		_fillname=_fillname.replace("（","_");
		_fillname=_fillname.replace("）","_");
	}
	
	
	return _fillname;
}


var TongBuFunction=function(n){
	var _fillname_daihouzui=n.substring(n.lastIndexOf('\\') + 1);
	var _fillname=_fillname_daihouzui.substring(0,_fillname_daihouzui.lastIndexOf('.'));
	//var _tablename=relationship[_fillname]==undefined ?_fillname:relationship[_fillname];//设置数据库需要更新的表名
	console.log(_fillname);//洞察表1
	fs.readFile(n, { encoding: 'utf-8' }, (err, csvData)=> {
	            if (err) 
	            {
	                console.log(err);
	            }
	            csvParser(csvData, { delimiter: ',' }, (err, data)=> {
	            	 if (err)
	                {
	                    console.log(err);
	                } 
	                else 
	                {
						
						var queryIfTableExists_sql="SELECT count(*) FROM information_schema.TABLES t, information_schema.SCHEMATA n WHERE t.table_name = ? AND n.SCHEMA_NAME = '"+sqlConfig.database+"'";
						  connection.query(queryIfTableExists_sql, [_fillname], (err,results,fields)=> {
						                    if (err) throw err;
											var _tableCount=results[0]['count(*)'];
											if(_tableCount==0){
												createTableAndInsertData(_fillname,data);
											}
											else{
												//备份旧的，插入新的
												var _now_str=(new Date()).Format("yyyyMMddhhmmss");
												var oldtableName=_fillname+'_'+_now_str;
												oldtableName=checkTableName(oldtableName);
												//这里如果不备份过去的就直接删掉这个表
												var rename_sql="RENAME TABLE "+_fillname+" TO "+oldtableName+" ;";
												console.log(rename_sql);
												
												
												var add_sql="";
												 connection.query(rename_sql, [_fillname,oldtableName], (err,results,fields)=> {
													  if (err) throw err;
													  createTableAndInsertData(_fillname,data);
												 });
											}
											
						                    });
						
					}//end else
					})});
}

module.exports.watch = function(p) {
	// 文件新增时
	function addFileListener(path_) {
		if(ready) {
			console.log('File', path_, 'has been added');
			TongBuFunction(path_);
		}
	}

	function addDirecotryListener(path) {
		if(ready) {
			console.log('Directory', path, 'has been added')
		}
	}

	// 文件内容改变时 只会监听某文件改变（不会监听文件名改动、新增文件）
	function fileChangeListener(path_,n,m) {
		console.log('File', path_, 'has been changed');
		TongBuFunction(path_);
		//将此文件入库
		//StartToTongBu(path_);
	}

	// 删除文件时，需要把文件里所有的用例删掉
	function fileRemovedListener(path_) {
		console.log('File', path_, 'has been removed')
	}

	// 删除目录时
	function directoryRemovedListener(path) {
		console.log('Directory', path, 'has been removed')
	}
	
	// 删除目录时
	function allListener(path) {
		
		console.log('Directory', path, 'alllll')
	}
	connection.connect();
	console.log('Mysql数据源连接成功！')
	if(!watcher) {
		watcher = chokidar.watch(p);
	}
	watcher
		.on('add', addFileListener)
		//.on('addDir', addDirecotryListener)
		.on('change', fileChangeListener)
		//.on('unlink', fileRemovedListener)
		//.on('unlinkDir', directoryRemovedListener)
		.on('error', function(error) {
			console.log('Error happened', error);
		})
		//.on('all', allListener)
		.on('ready', function() {
			console.info('Initial scan complete. Ready for changes.');
			ready = true
		})
}