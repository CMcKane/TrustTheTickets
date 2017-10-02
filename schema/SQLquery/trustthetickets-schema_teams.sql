-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: trustthetickets-schema
-- ------------------------------------------------------
-- Server version	5.7.19-log

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
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `teamID` int(11) NOT NULL AUTO_INCREMENT,
  `teamName` varchar(45) DEFAULT NULL,
  `sportTypeID` int(11) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`teamID`),
  KEY `sportTypeID` (`sportTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'76ers',1,'Philadelphia'),(2,'Celtics',1,'Boston'),(3,'Nets',1,'Brooklyn'),(4,'Knicks',1,'New York'),(5,'Raptors',1,'Toronto'),(6,'Warriors',1,'Oakland'),(7,'Clippers',1,'Los Angeles'),(8,'Lakers',1,'Los Angeles'),(9,'Phoenix Suns',1,'Phoenix'),(10,'Kings',1,'Sacramento'),(11,'Bulls',1,'Chicago'),(12,'Cavaliers',1,'Cleveland'),(13,'Pistons',1,'Detroit'),(14,'Pacers',1,'Indiana'),(15,'Bucks',1,'Milwaukee'),(16,'Mavericks',1,'Dallas'),(17,'Rockets',1,'Houston'),(18,'Grizzlies',1,'Memphis'),(19,'Pelicans',1,'New Orleans'),(20,'Spurs',1,'San Antonio'),(21,'Hawks',1,'Atlanta'),(22,'Hornets',1,'Charlotte'),(23,'Heat',1,'Miami'),(24,'Magic',1,'Orlando'),(25,'Wizards',1,'Washington'),(26,'Nuggets',1,'Denver'),(27,'Timberwolves',1,'Minnesota'),(28,'Trail Blazers',1,'Portland'),(29,'Jazz',1,'Utah');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-02 12:43:19
