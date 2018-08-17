CREATE DATABASE `basictest`;

CREATE TABLE `basictest`.`candidatetest` (
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
  `appliedjob` varchar(255) DEFAULT NULL,
  `submitdate` date NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `basictest`.`joblist` ( `id` int(10) NOT NULL AUTO_INCREMENT,
  `job` varchar(50) NOT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO `basictest`.`joblist` (`job`) VALUES ('HR Services Executive'),('Assistant General Manger - Sales'),('CEO-Retail'),('Financial Controller'),('Assistant Manager - HR & Admin'),('Head of Business Process Re-Engineering');

CREATE TABLE `basictest`.`credentials` ( `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `recruitername` varchar(50) NOT NULL,
  `usertype` varchar(50) NOT NULL,
  PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO  `basictest`.`credentials`(`username`, `password`,`recruitername`,`usertype`) VALUES ('user','pass','Dave','rct');
INSERT INTO  `basictest`.`credentials`(`username`, `password`,`recruitername`,`usertype`) VALUES ('manager','pass','Mave','mng');

ALTER TABLE `basictest`.`credentials` ADD `lastlogin` DATETIME NULL AFTER `usertype`;
