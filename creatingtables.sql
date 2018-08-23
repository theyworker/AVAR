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

ALTER TABLE `basictest`.`candidatetest` ADD `linkedinurl` VARCHAR(200) NULL AFTER `submitdate`, ADD `salaryrange` VARCHAR(50) NULL AFTER `linkedinurl`;

-- hidden column was added to the create table query

CREATE TABLE `basictest`.`joblist` ( `id` int(10) NOT NULL AUTO_INCREMENT,
  `job` varchar(50) NOT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `hidden` bool DEFAULT false,
  PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO `basictest`.`joblist` (`job`) VALUES ('HR Services Executive'),('Assistant General Manger - Sales'),('CEO-Retail'),('Financial Controller'),('Assistant Manager - HR & Admin'),('Head of Business Process Re-Engineering');

CREATE TABLE `basictest`.`credentials` ( `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `recruitername` varchar(50) NOT NULL,
  `usertype` varchar(50) NOT NULL,
  PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO  `basictest`.`credentials`(`username`, `password`,`recruitername`,`usertype`) VALUES ('user','$2b$10$roMjms2jkHkTb0O0OCiylu7mDabfc8Nez/F0KfUolf2ruoDc.Pfr2','Dave','rct');
INSERT INTO  `basictest`.`credentials`(`username`, `password`,`recruitername`,`usertype`) VALUES ('manager','$2b$10$roMjms2jkHkTb0O0OCiylu7mDabfc8Nez/F0KfUolf2ruoDc.Pfr2','Mave','mng');

ALTER TABLE `basictest`.`credentials` ADD `lastlogin` DATETIME NULL AFTER `usertype`;
ALTER TABLE `basictest`.`credentials` ADD `timeon` INT(50) NULL DEFAULT '0' AFTER `lastlogin`;
