-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 17 Février 2016 à 15:11
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `bigben`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id_category` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name_category` varchar(25) NOT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `category`
--

INSERT INTO `category` (`id_category`, `name_category`) VALUES
(1, 'London');

-- --------------------------------------------------------

--
-- Structure de la table `game`
--

CREATE TABLE IF NOT EXISTS `game` (
  `id_game` smallint(6) NOT NULL AUTO_INCREMENT,
  `id_category` tinyint(4) NOT NULL,
  PRIMARY KEY (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `level`
--

CREATE TABLE IF NOT EXISTS `level` (
  `id_question` smallint(6) NOT NULL,
  `id_category` tinyint(4) NOT NULL,
  `level` tinyint(4) NOT NULL,
  PRIMARY KEY (`id_question`,`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `level`
--

INSERT INTO `level` (`id_question`, `id_category`, `level`) VALUES
(1, 1, 4),
(2, 1, 3),
(3, 1, 2),
(4, 1, 3),
(5, 1, 1),
(6, 1, 10),
(7, 1, 8),
(8, 1, 9),
(9, 1, 5),
(10, 1, 5),
(11, 1, 1),
(12, 1, 7),
(13, 1, 6),
(14, 1, 8),
(15, 1, 4),
(16, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `match`
--

CREATE TABLE IF NOT EXISTS `match` (
  `id_game` smallint(6) NOT NULL,
  `id_user` int(11) NOT NULL,
  `point_match` int(11) NOT NULL,
  PRIMARY KEY (`id_game`,`id_user`),
  KEY `constraint_2` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE IF NOT EXISTS `question` (
  `id_question` smallint(6) NOT NULL AUTO_INCREMENT,
  `text_question` varchar(200) NOT NULL,
  `answer_1` varchar(50) NOT NULL,
  `answer_2` varchar(50) NOT NULL,
  `answer_3` varchar(50) NOT NULL,
  `answer_4` varchar(50) NOT NULL,
  `answer` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_question`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Contenu de la table `question`
--

INSERT INTO `question` (`id_question`, `text_question`, `answer_1`, `answer_2`, `answer_3`, `answer_4`, `answer`) VALUES
(1, 'In which famous address lived Sherlock Holmes ?', '221B Baker Street', '221 Baker Street', '221B Bakers Street', '221 Bakers Street', 1),
(2, 'What''s the name of the big wheel placed in London ?', 'Skyvue', 'Eurowheel', 'London Eye', 'Sky Wheel', 3),
(3, 'On what river was London built ?', 'The Cam', 'The Thames', 'The Seine', 'The Main', 2),
(4, 'The Kings and the Queens are traditionally crowned :', 'In St Paul''s Cathedral   ', 'In Buckingham Palace', 'In Westminster Abbey', 'In Notre Dame''s Cathedral', 3),
(5, 'Big Ben is :', 'A famous bell', 'A famous church', 'A famous abbey', 'The Queen', 1),
(6, 'What birds are associated with the Tower of London ?', 'Chickens', 'Pigeons', 'Ravens', 'Swallows', 3),
(7, 'London''s Underground is famous because :', 'It''s the biggest in the world', 'It''s the most used  in the world', ' It''s the most modern in the world', 'It''s the oldest in the world', 4),
(8, 'What are Heathrow and Gatwick ?', 'Underground stations', 'University', 'Airports', 'Railway stations', 3),
(9, 'What was the nickname of the famous serial killer who killed prostitutes in the XIXth ?', 'Jack the Ripper', 'Jack & Jones', 'Jack the Killer', 'Jack the Butcher', 1),
(10, 'What is the London Dungeon ?', 'The London Underground', 'A museum of horror', 'A restaurant', 'An old castle ', 2),
(11, 'In Britain, the currency is :', 'The pound', 'The euro', 'The dollar', 'The yen', 1),
(12, 'Beefeaters are :', 'Soldiers at Buckingham Palace', 'Security guards of the jewels of the Queen', 'Security guards at Mc Donald''s in London', 'Guards at the Tower of London', 4),
(13, 'What is the nickname for an English policeman ?', 'A Robby', 'A Robbie', 'A Hobby', 'A Bobby', 4),
(14, 'In which station does the Eurostar arrive and leave ?\r\n', 'St Pancras', 'Paddington', 'Waterloo', 'Croxley', 1),
(15, 'What''s the name of the famous bascule and suspension bridge in London ?', 'The Millenium Bridge', 'The Golden Gates', 'The Tower Bridge', 'The Queen Elizabeth II Bridge', 3),
(16, 'What''s the color of the double-decker buses ?', 'blue', 'black', 'yellow', 'red', 4);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name_user` varchar(30) NOT NULL,
  `pass_user` varchar(500) NOT NULL,
  `email_user` varchar(100) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `match`
--
ALTER TABLE `match`
  ADD CONSTRAINT `constraint_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `constraint_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
