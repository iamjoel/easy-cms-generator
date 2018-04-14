-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: amusement_admin_config
-- ------------------------------------------------------
-- Server version 5.7.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dict`
--

DROP TABLE IF EXISTS `dict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dict` (
  `key` varchar(25) NOT NULL,
  `label` varchar(45) NOT NULL,
  `value` varchar(300) NOT NULL,
  `id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`),
  UNIQUE KEY `label_UNIQUE` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dict`
--

LOCK TABLES `dict` WRITE;
/*!40000 ALTER TABLE `dict` DISABLE KEYS */;
INSERT INTO `dict` VALUES ('musicType','音乐类型','[{\"key\":\"pop\",\"label\":\"流行\"},{\"key\":\"classic\",\"label\":\"经典\"}]','4f421170-35e0-58f4-7122-bfbf092d2ebd'),('gender','性别','[{\"key\":\"1\",\"label\":\"男\"},{\"key\":\"0\",\"label\":\"女\"}]','88dda992-560f-567e-1b93-5480c0006ea0');
/*!40000 ALTER TABLE `dict` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entity` (
  `key` varchar(20) NOT NULL,
  `label` varchar(45) NOT NULL,
  `id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`),
  UNIQUE KEY `label_UNIQUE` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity`
--

LOCK TABLES `entity` WRITE;
/*!40000 ALTER TABLE `entity` DISABLE KEYS */;
INSERT INTO `entity` VALUES ('singer','歌手','58bec585-cb7b-4b21-c121-6a93db8e2428'),('song','歌曲','e033884b-b52c-405a-6d58-c09fe3694c9e');
/*!40000 ALTER TABLE `entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `list_page`
--

DROP TABLE IF EXISTS `list_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `list_page` (
  `id` varchar(36) NOT NULL,
  `basic` varchar(200) NOT NULL,
  `cols` varchar(9999) NOT NULL,
  `operate` varchar(999) NOT NULL,
  `searchCondition` varchar(999) DEFAULT NULL,
  `fn` varchar(999) DEFAULT NULL,
  `isFreeze` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list_page`
--

LOCK TABLES `list_page` WRITE;
/*!40000 ALTER TABLE `list_page` DISABLE KEYS */;
INSERT INTO `list_page` VALUES ('0178437f-5ee7-36cd-bcb3-53711324adeb','{\"entity\":\"singer\",\"isUpdatePageCommon\":true,\"codePath\":\"music/singer\",\"isCommon\":true}','[{\"label\":\"名称\",\"key\":\"name\",\"formatFn\":null}]','{\"add\":{\"isShow\":true},\"edit\":{\"isShow\":true},\"detail\":{\"isShow\":true},\"delete\":{\"isShow\":true}}','[{\"label\":\"名称\",\"key\":\"name\",\"dataType\":\"string\",\"dataSource\":{\"type\":\"\",\"key\":\"\"}}]','[]',0),('d780556b-c50f-f699-01e8-ee44dee29e42','{\"entity\":\"song\",\"isUpdatePageCommon\":false,\"isCommon\":false,\"codePath\":\"music/song\"}','[{\"label\":\"歌曲名称\",\"key\":\"name\",\"formatFn\":null},{\"label\":\"歌手\",\"key\":\"singer.name\",\"formatFn\":null},{\"label\":\"类型\",\"key\":\"type\",\"formatFn\":\"formatType\"}]','{\"add\":{\"isShow\":true},\"edit\":{\"isShow\":true},\"detail\":{\"isShow\":true},\"delete\":{\"isShow\":true}}','[{\"label\":\"歌名\",\"key\":\"name\",\"dataType\":\"string\",\"dataSource\":{\"type\":\"\",\"key\":\"\"}},{\"label\":\"歌曲类型\",\"key\":\"type\",\"dataType\":\"select\",\"dataSource\":{\"type\":\"dict\",\"key\":\"musicType\"}}]','[{\"name\":\"formatType\",\"args\":[\"row\"],\"body\":\"return this.getDictName(\'musicType\', row.type)\"},{\"name\":\"doSth\",\"args\":[\"row\"],\"body\":\"return row.singer.name + row.name\"}]',0);
/*!40000 ALTER TABLE `list_page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `key` varchar(20) NOT NULL,
  `label` varchar(45) NOT NULL,
  `id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('shop','店员','a6f6aa16-a16b-52d5-fd95-6303c278e4dc'),('admin','管理员','fbbd34d3-7b09-128c-8681-a86ccc934313');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `update_page`
--

DROP TABLE IF EXISTS `update_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `update_page` (
  `id` varchar(36) NOT NULL,
  `basic` varchar(100) NOT NULL,
  `cols` varchar(9999) NOT NULL,
  `fn` varchar(9999) NOT NULL,
  `isFreeze` int(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `update_page`
--

LOCK TABLES `update_page` WRITE;
/*!40000 ALTER TABLE `update_page` DISABLE KEYS */;
INSERT INTO `update_page` VALUES ('a90ab542-36db-f7af-bf03-fff6d6899c35','{\"entity\":\"singer\",\"isCommon\":true}','[{\"label\":\"歌手\",\"key\":\"name\",\"dataType\":\"string\",\"validRules\":[{\"name\":\"required\",\"errMsg\":\"请输入歌手名称\"}],\"formatFn\":null,\"saveFormatFn\":null}]','[]',0),('dede6489-5952-0225-859b-f8eb9779a5b7','{\"entity\":\"song\",\"codePath\":\"music/song\"}','[{\"label\":\"名称\",\"key\":\"name\",\"dataType\":\"string\",\"validRules\":[{\"name\":\"required\",\"errMsg\":\"请输入名称\"}],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"歌曲类型\",\"key\":\"type\",\"dataType\":\"select\",\"dataSource\":{\"type\":\"dict\",\"key\":\"musicType\"},\"validRules\":[{\"name\":\"required\",\"errMsg\":\"请选择歌曲类型\"}],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"歌手\",\"key\":\"singerId\",\"dataType\":\"select\",\"dataSource\":{\"type\":\"entity\",\"key\":\"singer\"},\"validRules\":[{\"name\":\"required\",\"errMsg\":\"请选择歌手\"}],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"创作时间\",\"key\":\"date\",\"dataType\":\"date\",\"validRules\":[],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"图片\",\"key\":\"img\",\"dataType\":\"img\",\"imgConfig\":{\"max\":5,\"tip\":\"建议尺寸 750 * 300\",\"size\":\"200\"},\"validRules\":[],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"多图测试\",\"key\":\"imgs\",\"dataType\":\"imgs\",\"imgConfig\":{\"max\":5,\"tip\":\"建议尺寸 750 * 300\",\"size\":\"150\"},\"validRules\":[],\"formatFn\":null,\"saveFormatFn\":null},{\"label\":\"排序值\",\"key\":\"sort\",\"dataType\":\"number\",\"validRules\":[{\"name\":\"required\",\"errMsg\":\"请输入排序值\"}],\"formatFn\":null,\"saveFormatFn\":null}]','[]',0);
/*!40000 ALTER TABLE `update_page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-14 23:27:50
