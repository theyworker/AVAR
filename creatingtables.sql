CREATE DATABASE `basictest`

CREATE TABLE `candidatetest` (
  `fname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `curemp` varchar(50) DEFAULT NULL,
  `curind` varchar(50) DEFAULT NULL,
  `quali` varchar(50) DEFAULT NULL,
  `demo` int(10) DEFAULT NULL,
  `remarks` varchar(50) DEFAULT NULL,
  `cvdir` varchar(50) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `basictest`.`joblist` ( `id` int(10) NOT NULL AUTO_INCREMENT,
  `job` varchar(50) NOT NULL,
  PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO joblist ('job') VALUES ('HR Services Executive'),('Assistant General Manger - Sales'),
('CEO-Retail'),('Financial Controller'),('Assistant Manager - HR & Admin'),('Head of Business Process Re-Engineering')