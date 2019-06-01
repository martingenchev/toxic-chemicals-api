-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 01, 2019 at 04:08 PM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toxic_chemical_industry`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_ticket`
-- (See below for the actual view)
--
CREATE TABLE `active_ticket` (
`warehouse_id` bigint(20) unsigned
,`quantity` int(30) unsigned
,`date` datetime
,`type` varchar(5)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_tickets`
-- (See below for the actual view)
--
CREATE TABLE `active_tickets` (
`id` bigint(20) unsigned
,`type` varchar(5)
,`warehouse_id` bigint(20) unsigned
,`quantity` int(30) unsigned
,`date` datetime
);

-- --------------------------------------------------------

--
-- Table structure for table `chemical_types`
--

CREATE TABLE `chemical_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chemical_types`
--

INSERT INTO `chemical_types` (`id`, `type`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `in_out` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `date`, `in_out`) VALUES
(1, '2019-05-20 19:54:28', 1),
(2, '2019-05-24 20:20:07', 1),
(3, '2019-05-24 20:26:50', 1),
(4, '2019-05-26 11:33:00', 1),
(5, '2019-05-27 10:16:22', 1),
(6, '2019-05-27 10:55:27', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_details`
--

CREATE TABLE `ticket_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `chemical_type_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(30) UNSIGNED NOT NULL,
  `warehouse_id` bigint(20) UNSIGNED NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket_details`
--

INSERT INTO `ticket_details` (`id`, `ticket_id`, `chemical_type_id`, `quantity`, `warehouse_id`, `active`) VALUES
(1, 1, 1, 2, 1, 0),
(2, 1, 2, 9, 2, 1),
(3, 1, 3, 4, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `capacity` int(30) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`id`, `capacity`) VALUES
(1, 10),
(2, 12),
(3, 5),
(4, 3),
(5, 9);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_inventory`
--

CREATE TABLE `warehouse_inventory` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `warehouse_id` bigint(20) UNSIGNED NOT NULL,
  `chemical_type_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(30) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warehouse_inventory`
--

INSERT INTO `warehouse_inventory` (`id`, `warehouse_id`, `chemical_type_id`, `quantity`) VALUES
(1, 1, 1, 4),
(2, 1, 2, 0),
(3, 1, 3, 4),
(4, 2, 1, 0),
(5, 2, 2, 1),
(6, 2, 3, 0),
(7, 3, 1, 0),
(8, 3, 2, 2),
(9, 3, 3, 0),
(10, 4, 1, 0),
(11, 4, 2, 0),
(12, 4, 3, 0),
(13, 5, 1, 0),
(14, 5, 2, 0),
(15, 5, 3, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `warehouse_inventory_view`
-- (See below for the actual view)
--
CREATE TABLE `warehouse_inventory_view` (
`warehouse_id` bigint(20) unsigned
,`type` varchar(5)
,`quantity` int(30) unsigned
,`capacity` int(30) unsigned
);

-- --------------------------------------------------------

--
-- Structure for view `active_ticket`
--
DROP TABLE IF EXISTS `active_ticket`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_ticket`  AS  select `ticket_details`.`warehouse_id` AS `warehouse_id`,`ticket_details`.`quantity` AS `quantity`,`tickets`.`date` AS `date`,`chemical_types`.`type` AS `type` from ((`ticket_details` join `chemical_types` on((`ticket_details`.`chemical_type_id` = `chemical_types`.`id`))) join `tickets` on((`ticket_details`.`ticket_id` = `tickets`.`id`))) where ((`tickets`.`in_out` = 1) and (`ticket_details`.`active` = 1)) ;

-- --------------------------------------------------------

--
-- Structure for view `active_tickets`
--
DROP TABLE IF EXISTS `active_tickets`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_tickets`  AS  select `ticket_details`.`id` AS `id`,`chemical_types`.`type` AS `type`,`ticket_details`.`warehouse_id` AS `warehouse_id`,`ticket_details`.`quantity` AS `quantity`,`tickets`.`date` AS `date` from ((`ticket_details` join `chemical_types` on((`ticket_details`.`chemical_type_id` = `chemical_types`.`id`))) join `tickets` on((`ticket_details`.`ticket_id` = `tickets`.`id`))) where (`ticket_details`.`active` = 1) ;

-- --------------------------------------------------------

--
-- Structure for view `warehouse_inventory_view`
--
DROP TABLE IF EXISTS `warehouse_inventory_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `warehouse_inventory_view`  AS  select `warehouse_inventory`.`warehouse_id` AS `warehouse_id`,`chemical_types`.`type` AS `type`,`warehouse_inventory`.`quantity` AS `quantity`,`warehouse`.`capacity` AS `capacity` from ((`warehouse_inventory` join `chemical_types` on((`warehouse_inventory`.`chemical_type_id` = `chemical_types`.`id`))) join `warehouse` on((`warehouse_inventory`.`warehouse_id` = `warehouse`.`id`))) order by `warehouse_inventory`.`warehouse_id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chemical_types`
--
ALTER TABLE `chemical_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `ticket_details`
--
ALTER TABLE `ticket_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `chemical_type_id` (`chemical_type_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `warehouse_inventory`
--
ALTER TABLE `warehouse_inventory`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `chemical_type_id` (`chemical_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chemical_types`
--
ALTER TABLE `chemical_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `ticket_details`
--
ALTER TABLE `ticket_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `warehouse_inventory`
--
ALTER TABLE `warehouse_inventory`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `ticket_details`
--
ALTER TABLE `ticket_details`
  ADD CONSTRAINT `ticket_details_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_details_ibfk_2` FOREIGN KEY (`chemical_type_id`) REFERENCES `chemical_types` (`id`),
  ADD CONSTRAINT `ticket_details_ibfk_3` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`);

--
-- Constraints for table `warehouse_inventory`
--
ALTER TABLE `warehouse_inventory`
  ADD CONSTRAINT `warehouse_inventory_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`),
  ADD CONSTRAINT `warehouse_inventory_ibfk_2` FOREIGN KEY (`chemical_type_id`) REFERENCES `chemical_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
