-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: ttt
-- ------------------------------------------------------
-- Server version	5.7.17-log

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
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `ticketID` int(11) NOT NULL,
  `accountID` int(11) NOT NULL,
  `eventTypeID` int(11) NOT NULL DEFAULT '1',
  `eventID` int(11) NOT NULL,
  `locationID` int(11) NOT NULL,
  `seatingChartID` int(11) NOT NULL,
  `ticketPrice` decimal(10,0) DEFAULT NULL,
  `sectionNumber` int(11) DEFAULT NULL,
  `seatNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`ticketID`),
  KEY `accountID_idx` (`accountID`),
  KEY `locationID_idx` (`locationID`),
  KEY `seatingChartID_idx` (`seatingChartID`),
  KEY `eventID_idx` (`eventID`),
  CONSTRAINT `accountID` FOREIGN KEY (`accountID`) REFERENCES `accounts` (`accountID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `eventID` FOREIGN KEY (`eventID`) REFERENCES `games` (`eventID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `locationID` FOREIGN KEY (`locationID`) REFERENCES `locations` (`locationID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `seatingChartID` FOREIGN KEY (`seatingChartID`) REFERENCES `seatingcharts` (`seatingChartID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,4,1,1,1,1,100,101,1),(2,4,1,1,1,1,100,101,2),(3,4,1,1,1,1,100,101,3),(4,4,1,1,1,1,100,101,4);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-04 15:16:50
