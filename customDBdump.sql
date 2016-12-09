-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: todoown
-- ------------------------------------------------------
-- Server version	5.7.16-log

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
-- Table structure for table `todoassignment`
--

DROP TABLE IF EXISTS `todoassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todoassignment` (
  `todoid` int(10) unsigned NOT NULL,
  `assigneeid` int(10) unsigned DEFAULT NULL,
  `assigndate` datetime DEFAULT NULL,
  KEY `assigneeid_idx` (`assigneeid`),
  CONSTRAINT `assigneeid` FOREIGN KEY (`assigneeid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todoassignment`
--

LOCK TABLES `todoassignment` WRITE;
/*!40000 ALTER TABLE `todoassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `todoassignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todoitem`
--

DROP TABLE IF EXISTS `todoitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `todoitem` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `creationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `duedate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed` tinyint(1) DEFAULT '0',
  `completionDate` datetime DEFAULT NULL,
  `priority` tinyint(1) DEFAULT '0',
  `description` varchar(256) DEFAULT NULL,
  `owner` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todoitem`
--

LOCK TABLES `todoitem` WRITE;
/*!40000 ALTER TABLE `todoitem` DISABLE KEYS */;
INSERT INTO `todoitem` VALUES (1,'Pick up meds','2016-12-09 11:11:56','2016-12-09 11:11:56',0,NULL,0,'Pick up my husband\'s meds from the pharmacy and put them into the daily pill box for him',1),(2,'Water the cacti','2016-12-09 11:12:52','2016-12-09 11:12:52',0,NULL,0,'The cacti should be watered once a month, so I should do it this week and also create a new todo item to water them next month',1),(3,'Finish knitting mittens','2016-12-09 11:13:33','2016-12-09 11:13:33',0,NULL,0,'I will see the grandchildren this weekend, and the mittens should be finished by then.',1),(4,'Send postcard to neice','2016-12-09 11:14:46','2016-12-09 11:14:46',0,NULL,0,'Neice\'s birthday coming up soon, so I should send a postcard',2),(5,'Pick up drycleaning','2016-12-09 11:15:07','2016-12-09 11:15:07',0,NULL,0,'Pick up suit from drycleaners',2);
/*!40000 ALTER TABLE `todoitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'dawnm','dawnmeadows@gmail.com','dawnm','2016-12-09 10:59:00','Dawn Meadows'),(2,'john1','johndavies@gmail.com','johnd','2016-12-09 10:59:45','John Davies'),(3,'gaaron','g_aaron@gmail.com','cats','2016-12-09 11:00:37','Gary Aaron');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-09 13:16:32
