/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50713
Source Host           : localhost:3306
Source Database       : zcmb

Target Server Type    : MYSQL
Target Server Version : 50713
File Encoding         : 65001

Date: 2019-11-06 13:45:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `FILE_ID` varchar(32) NOT NULL,
  `FILE_NAME` varchar(100) NOT NULL,
  `FILE_PATH` varchar(255) NOT NULL,
  `FILE_PID` varchar(32) NOT NULL,
  `ROOT_ID` varchar(32) DEFAULT NULL,
  `FILE_SIZE` double(10,0) DEFAULT NULL,
  `FILE_URL` varchar(255) DEFAULT NULL,
  `FILE_TYPE` varchar(1000) DEFAULT NULL,
  `FILE_NOTE` varchar(1000) DEFAULT NULL,
  `CREATE_TIME` datetime DEFAULT NULL,
  `UPDATE_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`FILE_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of file
-- ----------------------------

-- ----------------------------
-- Table structure for folder
-- ----------------------------
DROP TABLE IF EXISTS `folder`;
CREATE TABLE `folder` (
  `FOLDER_ID` varchar(32) NOT NULL COMMENT '主键',
  `FOLDER_CODE` varchar(1000) NOT NULL,
  `FOLDER_PID` varchar(32) NOT NULL COMMENT '父节点id',
  `FOLDER_ROOTID` varchar(32) DEFAULT NULL COMMENT '根节点id',
  `FOLDER_PATH` varchar(255) NOT NULL COMMENT '文件夹路径',
  `FOLDER_NAME` varchar(100) NOT NULL COMMENT '文件夹名称',
  `FOLDER_SIZE` double(10,0) DEFAULT '0' COMMENT '文件夹大小',
  `FOLDER_TYPE` int(1) DEFAULT '1' COMMENT '文件夹类型',
  `FOLDER_NOTE` varchar(1000) DEFAULT NULL COMMENT '文件夹备注',
  `CREATETIME` datetime DEFAULT NULL COMMENT '创建时间',
  `UPDATETIME` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`FOLDER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `userName` varchar(32) NOT NULL,
  `passWord` varchar(50) NOT NULL,
  `realName` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of test
-- ----------------------------
INSERT INTO `test` VALUES ('1', '1', '1', '1');
