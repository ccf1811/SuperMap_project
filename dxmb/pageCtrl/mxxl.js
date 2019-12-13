/***************************************************   树形组件开始   *****************************************************/
var settingss = {
	data: {
		simpleData: {
			enable: true, //true 、 false 分别表示 使用 、 不使用 简单数据模式
			idKey: "id", //节点数据中保存唯一标识的属性名称
			pIdKey: "parentId", //节点数据中保存其父节点唯一标识的属性名称  
			rootPId: -1 //用于修正根节点父节点数据，即 pIdKey 指定的属性值
		},
		key: {
			name: "name" //zTree 节点数据保存节点名称的属性名称  默认值："name"
		}
	},
	callback: {
		onClick: zTreeOnClick
	}
};

// 数据
var zNodes = [
	//注意，数据中的 menuName 必须与 settingss 中key 中定义的name一致，否则找不到
	{
		name: "模拟训练",
		open: false,
		children: [{
			name: "103KJ基地",
		}, {
			name: "101KJ基地",
		}, {
			name: "102KJ基地",
		}]
	},
];

zTreeObj = $.fn.zTree.init($("#treeDemo"), settingss, zNodes); //初始化树
zTreeObj.expandAll(true);

var newCount = 1;

function addHoverDom(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
		"' title='添加子节点' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_" + treeNode.tId);
	if (btn) btn.bind("click", function() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var newnade = {
			id: (100 + newCount),
			name: "new node" + (newCount++)
		};
		zTree.addNodes(treeNode, newnade);
		var node = zTree.getNodesByParam("id", (99 + newCount), null);
		console.log(node);
		zTree.editName(node[0]);
	});
}

function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
};


var zTreeFlag = false;
function zTreeOnClick(event, treeId, treeNode) {
	zTreeFlag = true;
	if (treeNode.name == '103KJ基地') {
		var dataInfo = [{
			'src': '../img/train/mubiao1/fjtq'
		}];
		$("#module-show").empty();
		// 清空内容区域
		var $pageBox = $("#module-show");
		// 清空内容区域
		$pageBox.empty();
		for (var i = 1; i < 49; i++) {
			var imgsrc = dataInfo[0].src + i + '.png';
			var newElement = "";
				newElement += "<div class='layui-col-md1 train_picture'>";
				newElement += "<img id='" + i + "' src='" + imgsrc + "' style='width: 100%; height:auto;'>";
				newElement += "</div>";
			$("#module-show").append(newElement);
		}
	} else if (treeNode.name == '101KJ基地') {
		var dataInfo = [{
			'src': '../img/train/mubiao2/fjtqt'
		}];
		$("#module-show").empty();
		// 清空内容区域
		var $pageBox = $("#module-show");
		// 清空内容区域
		$pageBox.empty();
		for (var i = 1; i < 49; i++) {
			var imgsrc = dataInfo[0].src + i + '.png';
			var newElement = "";
				newElement += "<div class='layui-col-md1 train_picture'>";
				newElement += "<img id='" + i + "' src='" + imgsrc + "' style='width: 100%; height:auto;'>";
				newElement += "</div>";
			$("#module-show").append(newElement);
		}
	} else if (treeNode.name == '102KJ基地') {
		var dataInfo = [{
			'src': '../img/train/mubiao3/fjtqth'
		}];
		$("#module-show").empty();
		// 清空内容区域
		var $pageBox = $("#module-show");
		// 清空内容区域
		$pageBox.empty();
		for (var i = 1; i < 49; i++) {
			var imgsrc = dataInfo[0].src + i + '.png';
			var newElement = "";
				newElement += "<div class='layui-col-md1 train_picture'>";
				newElement += "<img id='" + i + "' src='" + imgsrc + "' style='width: 100%; height:auto;'>";
				newElement += "</div>";
			$("#module-show").append(newElement);
		}
	}



};

//JavaScript代码区域
layui.use('element', function() {
	var element = layui.element;
	var $ = layui.jquery,
		layer = layui.layer;

});

layui.use('layer', function() {
	var $ = layui.jquery,
		layer = layui.layer;

	layer.style('index', {
		height: "100%"
	})
});


/**
 * 开始训练
 */
var trainFlag = false;
function startTrain() {
	if (zTreeFlag == true) {
		trainFlag = true;
		$("img").click(function() {
			if ($("#" + event.target.id).css('filter') == 'brightness(0.6)') {
				$("#" + event.target.id).css('filter', 'brightness(100%)');
			} else {
				$("#" + event.target.id).css('filter', 'brightness(60%)');
			}
		});
	}
}
/**
 * 结束训练
 */
function overTrain() {
	if (trainFlag == true) {
		var index1 = layer.open({
			type: 1,
			skin: 'layui-bg-gray',
			shadeClose: false,
			resize: false,
			anim: 5,
			move: false,
			title: "训练结束",
			area: ['300px', '200px'],
			btn: ['继续训练', '目标提取'],
			yes: function(index, layero) {
				parent.showPageOfXL('tymb');
			},
			btn2: function(index, layero) {
				parent.showPageOfMB('tymb');
			},
			cancel: function() {
				//右上角关闭回调
				//return false 开启该代码可禁止点击该按钮关闭
			},
			content: $("#traincg")
		})
	}
}
