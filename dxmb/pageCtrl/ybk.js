// 初始化页面
function initPage() {
	initYBKTree();
}

initPage();

var newCount = 1;

/**
 * 显示文件上传页面
 */
function showFileUploadWindows() {
	var index = layer.open({
		type: 1,
		id: 10086,
		title: "文件上传",
		area: ['800px', '600px'],
		content: $("#file_upload_box"),
		cancel: function(index, layero) {
			getFileList($("#folderCode").val());
		}
	});
}

/**
 * 搜索页面
 */
function queryfile() {
	var filename = $("#queryf").val();
	$.ajax({
		url: httpURL + "file/queryFilesByName", //地址
		dataType: 'json', //数据类型
		type: 'POST', //类型
		data: {
			"fileName": filename,
			"pid": $("#filePid").val()
		}, //参数
		//请求成功
		success: function(res) {
			$("#module-show").empty();
			for (var i = 0; i < res.length; i++) {
				var photoPathStart = res[i].filePath.indexOf(".");
				var phototSuffix = res[i].filePath.substring(photoPathStart + 1, photoPathStart.length);
				console.log(phototSuffix);
				console.log(res);
				if (phototSuffix == 'png' || phototSuffix == 'jpg') {
					var htmlStr = "";
					htmlStr += " <div class='layui-col-md2 picture'> ";
					htmlStr += " <div class='layui-row' style='background-color: #828485;'> ";
					htmlStr += " <div class='layui-col-md9' style='text-align: center; height: 25px;'> ";
					htmlStr += " <p class='layui-elip' data-d='" + res[i].fileName + "' onmouseover='showtips(this)'>" + res[i].fileName +
						"</p>";
					htmlStr += " </div> ";
					htmlStr += " <div class='layui-col-md1 button-area'> ";
					htmlStr += " <i onclick='createlb(" + JSON.stringify(res).replace(/'/g, '&quot;') + ", " + i +
						")' class='layui-icon layui-icon-picture-fine' style='font-size: 20px; color: white;'></i> ";
					htmlStr += " </div> ";
					htmlStr += " <div class='layui-col-md1 button-area'> ";
					htmlStr +=
						" <i class='layui-icon layui-icon-delete' style='font-size: 20px; color: white;' onclick='deleteFile(\"" + res[
							i].fileId + "\")'></i> ";
					htmlStr += " </div> ";
					htmlStr += " </div> ";
					htmlStr += " <img onclick='createlb(" + JSON.stringify(res).replace(/'/g, '&quot;') + "," + i +
						")' src='../resource" + res[i].filePath + "' style='width: 100%; height: 125px;'> ";
					htmlStr += " </div> ";
					$("#module-show").append(htmlStr);
				}

			}
		},
		//失败/超时
		error: function() {
			alert("查询失败，请重试！");
		},
	})
}

layui.use('upload', function() {
	var upload = layui.upload;
	//多文件列表示例
	var fileListView = $('#file_details_list');
	// 清空内容区域
	var uploadListIns = upload.render({
		elem: '#selectUploadbtn',
		url: httpURL + '/file/fileUpload',
		accept: 'file',
		multiple: true,
		auto: false,
		bindAction: '#fileuploadbtn',
		before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
			this.data = {
				filePid: $("#filePid").val()
			};
			layer.load(); //上传loading
		},
		choose: function(obj) {
			var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
			//读取本地文件
			obj.preview(function(index, file, result) {
				var htmlstr = '';
				htmlstr += '<tr id="upload-' + index + '">';
				htmlstr += '<td>' + file.name + '</td>';
				htmlstr += '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>';
				htmlstr += '<td>等待上传</td>';
				htmlstr += '<td>';
				htmlstr += '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>';
				htmlstr += '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>';
				htmlstr += '</td>';
				htmlstr += '</tr>';
				var tr = $([htmlstr].join(''));
				//单个重传
				tr.find('.demo-reload').on('click', function() {
					obj.upload(index, file);
				});

				//删除
				tr.find('.demo-delete').on('click', function() {
					delete files[index]; //删除对应的文件
					tr.remove();
					uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
				});

				fileListView.append(tr);
			});
		},
		done: function(res, index, upload) {
			layer.closeAll('loading'); //关闭loading
			if (res.code == 0) { //上传成功
				var tr = fileListView.find('tr#upload-' + index),
					tds = tr.children();
				tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
				tds.eq(3).html(''); //清空操作
				return delete this.files[index]; //删除文件队列已经上传成功的文件
			}
			this.error(index, upload);
		},
		error: function(index, upload) {
			layer.closeAll('loading'); //关闭loading
			var tr = fileListView.find('tr#upload-' + index),
				tds = tr.children();
			tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
			tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
		}
	});
});

/*******************************************************************    树形组件开始   *****************************************************/
var YBKTree; // 样本库构建全局树对象

/**
 * 初始化树组织
 */
function initYBKTree() {
	intTreeNode = [{
		"id": "",
		"pId": "",
		"name": "根目录",
		"fullName": "\\",
		"realId": "",
		"checked": true,
		"open": false,
		"isParent": true
	}];
	// 树属性设置
	treeSetting = {
		edit: {
			enable: true,
			editNameSelectAll: true,
			showRenameBtn: true,
			renameTitle: "重命名",
			showRemoveBtn: true,
			removeTitle: "删除文件夹",
			showRenameBtn: true
		},
		view: {
			addHoverDom: addHoverDom, // 用于当鼠标移动到节点上时，显示用户自定义控件
			removeHoverDom: removeHoverDom, // 用于当鼠标移出节点时，隐藏用户自定义控件
			selectedMulti: true,
			showIcon: true,
			showLine: true
		},
		callback: {
			beforeExpand: treeBeforeExpand,
			onClick: treeOnClick,
			onRename: zTreeOnRename,
			onRemove: zTreeOnRemove
		}
	};
	// 初始化树
	YBKTree = $.fn.zTree.init($("#ybkTree"), treeSetting, intTreeNode); //初始化树
}

/**
 * 新建目录
 * @param {Object} treeId 树节点id
 * @param {Object} treeNode 节点对象
 * 
 */
function addHoverDom(treeId, treeNode) {
	var newNodeObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) {
		return;
	}

	var addSpan = "";
	addSpan += "<span class='button add' id='addBtn_" + treeNode.tId + "' title='新建文件夹' onfocus='this.blur();'></span>";
	addSpan += "<span id='downloadBtn_" + treeNode.tId +
		"' title='文件夹下载' onfocus='this.blur();'><i class='layui-icon layui-icon-download-circle' style='color: #f60707;'></i></span>";
	newNodeObj.after(addSpan);
	// 新建文件夹按钮
	var addbtn = $("#addBtn_" + treeNode.tId);
	if (addbtn) {
		addbtn.bind("click", function() {
			addFolder(treeId, treeNode);
		});
	}
	// 下载文件夹按钮
	var downloadBtn = $("#downloadBtn_" + treeNode.tId);
	if (downloadBtn) {
		downloadBtn.bind("click", function() {
			downloadFolder(treeId, treeNode);
		});
	}
}

/**
 * @param {Object} treeId
 * @param {Object} treeNode
 */
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
	$("#downloadBtn_" + treeNode.tId).unbind().remove();
};

/**
 * 文件夹下载
 * @param {Object} treeId 当前树节点id
 * @param {Object} treeNode 当前树节点
 */
function downloadFolder(treeId, treeNode) {
	var form = $("<form>");
	form.attr("style", "display:none");
	form.attr("target", "");
	form.attr("enctype", "multipart/form-data");
	form.attr("method", "get");
	form.attr("action", httpURL + "folder/downloadFolder");
	var fromInput = $("<input>");
	fromInput.attr("type", "hidden");
	fromInput.attr("name", "folderId");
	fromInput.attr("value", treeNode.realId);
	$("body").append(form);
	form.append(fromInput);
	form.submit();
	form.remove();
}

/**
 * 添加子节点
 * @param {Object} treeId
 * @param {Object} treeNode
 */
function addFolder(treeId, treeNode) {
	var maxindex = -1;
	var childrenNodes = treeNode.children || [];
	childrenNodes.forEach(function(value, index, array) {
		if (value.name && (value.name.indexOf("新建文件夹") != -1)) {
			var startIndex = value.name.indexOf("（");
			var endIndex = value.name.indexOf("）");
			maxindex = value.name.substring(startIndex + 1, endIndex);
		}
	});
	var newFolderName = maxindex == -1 ? "新建文件夹" : maxindex == 0 ? "新建文件夹（" + 1 + "）" : "新建文件夹（" + (parseInt(maxindex) + 1) +
		"）";
	var newnade = {
		pId: treeNode.realId,
		name: newFolderName,
		checked: false,
		open: false,
		isParent: false
	};
	// 数据库插入记录
	$.ajax({
		type: 'POST',
		url: httpURL + "folder/saveFolder",
		data: {
			folderPid: newnade.pId,
			folderName: newnade.name,
		},
		dataType: 'json',
		success: function(data) {
			// 设置节点坐标的树形
			newnade.id = data.folderCode;
			newnade.realId = data.folderId;
			newnade.fullName = data.folderName;
			YBKTree.addNodes(treeNode, newnade);
		}
	});
}

/**
 * 刷新选中的树节点(删除、添加、修改时调用)
 */
function refreshOrgTree() {
	var folderCode = "";
	treeNode = YBKTree.getNodeByParam("id", folderCode, null);
	treeNode.hasExpand = false;
	treeBeforeExpand("", treeNode);
}


/**
 * 树节点展开前执行
 */
function treeBeforeExpand(treeId, treeNode) {
	if (!treeNode.hasExpand) {
		$.ajax({
			type: 'POST',
			url: httpURL + "folder/findFolderTreeList",
			data: {
				treeCode: treeNode.id
			},
			dataType: 'json',
			success: function(data) {
				loadTree(data, treeNode);
				getFileList(treeNode.id);
				treeNode.hasExpand = true;
			}
		});
	}
}

/**
 * 树节点点击执行
 */
function treeOnClick(event, treeId, treeNode) {
	$("#filePid").attr("value", treeNode.realId);
	$("#folderCode").attr("value", treeNode.id);
	filePath = treeNode.fullName;
	treeBeforeExpand(treeId, treeNode);
	getFileList(treeNode.id);
}


/**
 * 点击树时刷新图片页面
 */
function getFileList(treeCode) {
	var nodes = YBKTree.getSelectedNodes();
	var folderCode = '';
	if (nodes.length > 0) {
		folderCode = nodes[0].id;
	}
	$.ajax({
		type: 'POST',
		url: httpURL + "file/loadAllFiles",
		data: {
			filePid: $("#filePid").val()
		},
		dataType: 'json',
		success: function(res) {
			$("#module-show").empty();
			for (var i = 0; i < res.length; i++) {
				var photoPathStart = res[i].filePath.indexOf(".");
				var phototSuffix = res[i].filePath.substring(photoPathStart + 1, photoPathStart.length);
				console.log(phototSuffix);
				console.log(res);
				if (phototSuffix == 'png' || phototSuffix == 'jpg') {
					var htmlStr = "";
					htmlStr += " <div class='layui-col-md2 picture'> ";
					htmlStr += " <div class='layui-row' style='background-color: #828485;'> ";
					htmlStr += " <div class='layui-col-md9' style='text-align: center; height: 25px;'> ";
					htmlStr += " <p class='layui-elip' data-d='" + res[i].fileName + "' onmouseover='showtips(this)'>" + res[i].fileName +
						"</p>";
					htmlStr += " </div> ";
					htmlStr += " <div class='layui-col-md1 button-area'> ";
					htmlStr += " <i onclick='createlb(" + JSON.stringify(res).replace(/'/g, '&quot;') + ", " + i +
						")' class='layui-icon layui-icon-picture-fine' style='font-size: 20px; color: white;'></i> ";
					htmlStr += " </div> ";
					htmlStr += " <div class='layui-col-md1 button-area'> ";
					htmlStr +=
						" <i class='layui-icon layui-icon-delete' style='font-size: 20px; color: white;' onclick='deleteFile(\"" + res[
							i].fileId + "\")'></i> ";
					htmlStr += " </div> ";
					htmlStr += " </div> ";
					htmlStr += " <img onclick='createlb(" + JSON.stringify(res).replace(/'/g, '&quot;') + "," + i +
						")' src='../resource" + res[i].filePath + "' style='width: 100%; height: 125px;'> ";
					htmlStr += " </div> ";
					$("#module-show").append(htmlStr);
				}

			}
			var element = "";
			element += " <div class='layui-col-md2 picture'>";
			element +=
				" <div style='background-color: #828485; text-align: center; color: white; height: 25px; line-height: 25px;'>新建</div>";
			element += " <div style='height: 125px; background-color:#c1cacf; text-align: center;'>";
			element += " <div id='create' onclick='showFileUploadWindows()'> ";
			element += " <i class='layui-icon layui-icon-add-1' style='font-size: 100px; color: white;'></i>";
			element += " </div>";
			element += " </div>";
			element += " </div>";
			$("#module-show").append(element);
		}
	});
}

/**
 * 鼠标悬停显示
 * @param {Object} t
 */
function showtips(t) {
	var row = $(t).attr('data-d'); //获取显示内容
	var labelhtnl = '<label class="label-text">' + row + '</label>';
	//小tips
	layer.tips(labelhtnl, t, {
		tips: [1, '#b2b2b2'],
		time: 3000
	})
}

function showFileInit(t) {
	var labelhtnl = '<label class="label-text">' + '数据库初始化' + '</label>';
	//小tips
	layer.tips(labelhtnl, t, {
		tips: [2, '#b2b2b2'],
		time: 3000
	})
}
/**
 * create by yuliyang
 * 弹出层显示轮播图
 * 
 */
function createlb(res, index) {
	$("#carousel_box").empty();
	for (var i = 0; i < res.length; i++) {
		var ltphotoPathStart = res[i].filePath.indexOf(".");
		var ltphototSuffix = res[i].filePath.substring(ltphotoPathStart + 1, ltphotoPathStart.length);
		console.log(ltphototSuffix);
		if (ltphototSuffix == 'png' || ltphototSuffix == 'jpg') {
			//动态添加轮播图中的图片
			var lbtElement = "";
			lbtElement += " <div> ";
			lbtElement += " <img src='../resource" + res[i].filePath + "' style='width: 100% ; height: auto;'> ";
			lbtElement += " </div> ";
			$("#carousel_box").append(lbtElement);
		}
	}

	layer.open({
		type: 1,
		shadeClose: true,
		resize: false,
		move: false,
		title: "图片预览",
		area: ['1200px', '700px'],
		content: $("#carousel_plugin"),
	})
	// 使用轮播图组件
	layui.use('carousel', function() {
		var carousel = layui.carousel;
		var ins = carousel.render({
			elem: '#carousel_plugin',
			width: '100%', //设置容器宽度
			height: '100%',
			arrow: 'always', //始终显示箭头
			autoplay: false
		});
		ins.reload({
			elem: '#carousel_plugin',
			width: '100%', //设置容器宽度
			height: '100%',
			arrow: 'always', //始终显示箭头
			index: index
		});
	});
}



/**
 * @param {Object} obj 文件主键
 */
function deleteFile(obj) {
	$.ajax({
		url: httpURL + "/file/removeFile", //地址
		dataType: 'json', //数据类型
		type: 'POST', //类型
		data: {
			fileId: obj
		}, //参数
		//请求成功
		success: function() {
			getFileList($("#folderCode").val());
		},
		//失败/超时
		error: function() {
			alert("删除失败，请重试！");
		},
	})
}

/**
 * 逐级加载树
 */
function loadTree(data, node) {
	YBKTree.removeChildNodes(node);
	if (data.length > 0) {
		node.hasExpand = true;
		YBKTree.addNodes(node, data, false);
	}
	YBKTree.updateNode(node);
	YBKTree.selectNode(node);
}

/**
 *  编辑节点
 */
function zTreeOnRename(event, treeId, treeNode, isCancel) {
	// 数据库插入记录
	$.ajax({
		type: 'POST',
		url: httpURL + "folder/updateFolder",
		data: {
			folderId: treeNode.realId,
			folderCode: treeNode.id,
			folderPid: treeNode.pId,
			folderName: treeNode.name
		},
		dataType: 'json',
	});
}

/**
 * 删除节点
 */
function zTreeOnRemove(e, treeId, treeNode) {
	$.ajax({
		type: 'POST',
		url: httpURL + "folder/removeFolderById",
		data: {
			folderId: treeNode.realId
		},
		dataType: 'json',
		//请求成功
		success: function() {
			$("#module-show").empty();
		},
		//失败/超时
		error: function() {
			alert("删除失败，请重试！");
		},
	});
}

/**
 * 初始化样本库
 */
function synchronizeFoldersToDatabase() {
	// 弹出确认框
	layer.confirm('是否初始化样本库', {
		icon: 3,
		title: '提示'
	}, function(index) {
		var index;
		// ajax请求删除数据库
		$.ajax({
			type: 'POST',
			url: httpURL + "folder/synchronizeFoldersToDatabase",
			data: {
				filePath: initPath
			},
			dataType: 'json',
			beforeSend: function() {
				index = layer.load();
			},
			//请求成功
			success: function(data) {
				layer.close(index);
				if (data.code == '0') {
					layer.alert('初始化成功');
				} else {
					layer.alert(data.msg);
				}
			},
			error: function() {
				layer.close(index);
				layer.alert('连接错误');
			},
		});
		layer.close(index);
	});
}
