CREATE DATABASE `basictest`

CREATE TABLE `candidatetest` (
  `fname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `curemp` varchar(50) DEFAULT NULL,
  `curind` varchar(50) DEFAULT NULL,
  `quali` varchar(50) DEFAULT NULL,
  `demo` int(10) DEFAULT NULL,
  `remarks` varchar(50) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;