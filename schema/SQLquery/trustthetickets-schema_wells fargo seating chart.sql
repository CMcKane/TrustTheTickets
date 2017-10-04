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
-- Table structure for table `wells fargo seating chart`
--

DROP TABLE IF EXISTS `wells fargo seating chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wells fargo seating chart` (
  `seatingChartID` int(11) NOT NULL AUTO_INCREMENT,
  `sectionNumber` int(11) DEFAULT NULL,
  `seatNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`seatingChartID`)
) ENGINE=InnoDB AUTO_INCREMENT=442 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wells fargo seating chart`
--

LOCK TABLES `wells fargo seating chart` WRITE;
/*!40000 ALTER TABLE `wells fargo seating chart` DISABLE KEYS */;
INSERT INTO `wells fargo seating chart` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(25,1,25),(26,1,26),(27,1,27),(28,1,28),(29,1,29),(30,1,30),(31,1,31),(32,1,32),(33,1,33),(34,1,34),(35,1,35),(36,1,36),(37,1,37),(38,1,38),(39,1,39),(40,1,40),(41,1,41),(42,1,42),(43,1,43),(44,1,44),(45,1,45),(46,1,46),(47,1,47),(48,1,48),(49,1,49),(50,2,1),(51,2,2),(52,2,3),(53,2,4),(54,2,5),(55,2,6),(56,2,7),(57,2,8),(58,2,9),(59,2,10),(60,2,11),(61,2,12),(62,2,13),(63,2,14),(64,2,15),(65,2,16),(66,2,17),(67,2,18),(68,2,19),(69,2,20),(70,2,21),(71,2,22),(72,2,23),(73,2,24),(74,2,25),(75,2,26),(76,2,27),(77,2,28),(78,2,29),(79,2,30),(80,2,31),(81,2,32),(82,2,33),(83,2,34),(84,2,35),(85,2,36),(86,2,37),(87,2,38),(88,2,39),(89,2,40),(90,2,41),(91,2,42),(92,2,43),(93,2,44),(94,2,45),(95,2,46),(96,2,47),(97,2,48),(98,2,49),(99,3,1),(100,3,2),(101,3,3),(102,3,4),(103,3,5),(104,3,6),(105,3,7),(106,3,8),(107,3,9),(108,3,10),(109,3,11),(110,3,12),(111,3,13),(112,3,14),(113,3,15),(114,3,16),(115,3,17),(116,3,18),(117,3,19),(118,3,20),(119,3,21),(120,3,22),(121,3,23),(122,3,24),(123,3,25),(124,3,26),(125,3,27),(126,3,28),(127,3,29),(128,3,30),(129,3,31),(130,3,32),(131,3,33),(132,3,34),(133,3,35),(134,3,36),(135,3,37),(136,3,38),(137,3,39),(138,3,40),(139,3,41),(140,3,42),(141,3,43),(142,3,44),(143,3,45),(144,3,46),(145,3,47),(146,3,48),(147,3,49),(148,4,1),(149,4,2),(150,4,3),(151,4,4),(152,4,5),(153,4,6),(154,4,7),(155,4,8),(156,4,9),(157,4,10),(158,4,11),(159,4,12),(160,4,13),(161,4,14),(162,4,15),(163,4,16),(164,4,17),(165,4,18),(166,4,19),(167,4,20),(168,4,21),(169,4,22),(170,4,23),(171,4,24),(172,4,25),(173,4,26),(174,4,27),(175,4,28),(176,4,29),(177,4,30),(178,4,31),(179,4,32),(180,4,33),(181,4,34),(182,4,35),(183,4,36),(184,4,37),(185,4,38),(186,4,39),(187,4,40),(188,4,41),(189,4,42),(190,4,43),(191,4,44),(192,4,45),(193,4,46),(194,4,47),(195,4,48),(196,4,49),(197,5,1),(198,5,2),(199,5,3),(200,5,4),(201,5,5),(202,5,6),(203,5,7),(204,5,8),(205,5,9),(206,5,10),(207,5,11),(208,5,12),(209,5,13),(210,5,14),(211,5,15),(212,5,16),(213,5,17),(214,5,18),(215,5,19),(216,5,20),(217,5,21),(218,5,22),(219,5,23),(220,5,24),(221,5,25),(222,5,26),(223,5,27),(224,5,28),(225,5,29),(226,5,30),(227,5,31),(228,5,32),(229,5,33),(230,5,34),(231,5,35),(232,5,36),(233,5,37),(234,5,38),(235,5,39),(236,5,40),(237,5,41),(238,5,42),(239,5,43),(240,5,44),(241,5,45),(242,5,46),(243,5,47),(244,5,48),(245,5,49),(246,6,1),(247,6,2),(248,6,3),(249,6,4),(250,6,5),(251,6,6),(252,6,7),(253,6,8),(254,6,9),(255,6,10),(256,6,11),(257,6,12),(258,6,13),(259,6,14),(260,6,15),(261,6,16),(262,6,17),(263,6,18),(264,6,19),(265,6,20),(266,6,21),(267,6,22),(268,6,23),(269,6,24),(270,6,25),(271,6,26),(272,6,27),(273,6,28),(274,6,29),(275,6,30),(276,6,31),(277,6,32),(278,6,33),(279,6,34),(280,6,35),(281,6,36),(282,6,37),(283,6,38),(284,6,39),(285,6,40),(286,6,41),(287,6,42),(288,6,43),(289,6,44),(290,6,45),(291,6,46),(292,6,47),(293,6,48),(294,6,49),(295,7,1),(296,7,2),(297,7,3),(298,7,4),(299,7,5),(300,7,6),(301,7,7),(302,7,8),(303,7,9),(304,7,10),(305,7,11),(306,7,12),(307,7,13),(308,7,14),(309,7,15),(310,7,16),(311,7,17),(312,7,18),(313,7,19),(314,7,20),(315,7,21),(316,7,22),(317,7,23),(318,7,24),(319,7,25),(320,7,26),(321,7,27),(322,7,28),(323,7,29),(324,7,30),(325,7,31),(326,7,32),(327,7,33),(328,7,34),(329,7,35),(330,7,36),(331,7,37),(332,7,38),(333,7,39),(334,7,40),(335,7,41),(336,7,42),(337,7,43),(338,7,44),(339,7,45),(340,7,46),(341,7,47),(342,7,48),(343,7,49),(344,8,1),(345,8,2),(346,8,3),(347,8,4),(348,8,5),(349,8,6),(350,8,7),(351,8,8),(352,8,9),(353,8,10),(354,8,11),(355,8,12),(356,8,13),(357,8,14),(358,8,15),(359,8,16),(360,8,17),(361,8,18),(362,8,19),(363,8,20),(364,8,21),(365,8,22),(366,8,23),(367,8,24),(368,8,25),(369,8,26),(370,8,27),(371,8,28),(372,8,29),(373,8,30),(374,8,31),(375,8,32),(376,8,33),(377,8,34),(378,8,35),(379,8,36),(380,8,37),(381,8,38),(382,8,39),(383,8,40),(384,8,41),(385,8,42),(386,8,43),(387,8,44),(388,8,45),(389,8,46),(390,8,47),(391,8,48),(392,8,49),(393,9,1),(394,9,2),(395,9,3),(396,9,4),(397,9,5),(398,9,6),(399,9,7),(400,9,8),(401,9,9),(402,9,10),(403,9,11),(404,9,12),(405,9,13),(406,9,14),(407,9,15),(408,9,16),(409,9,17),(410,9,18),(411,9,19),(412,9,20),(413,9,21),(414,9,22),(415,9,23),(416,9,24),(417,9,25),(418,9,26),(419,9,27),(420,9,28),(421,9,29),(422,9,30),(423,9,31),(424,9,32),(425,9,33),(426,9,34),(427,9,35),(428,9,36),(429,9,37),(430,9,38),(431,9,39),(432,9,40),(433,9,41),(434,9,42),(435,9,43),(436,9,44),(437,9,45),(438,9,46),(439,9,47),(440,9,48),(441,9,49);
/*!40000 ALTER TABLE `wells fargo seating chart` ENABLE KEYS */;
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