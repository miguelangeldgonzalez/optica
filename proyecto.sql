-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2023 at 12:58 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proyecto`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `cliente_id` int(11) NOT NULL,
  `nombres` varchar(55) NOT NULL,
  `sexo` text NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `cedula` int(11) NOT NULL,
  `telefono` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`cliente_id`, `nombres`, `sexo`, `fecha_nacimiento`, `cedula`, `telefono`) VALUES
(1, 'Miguelangel', 'M', '2023-05-22', 30681332, 2147483647),
(2, 'Miguelangel', 'M', '2023-05-15', 30681332, 2147483647),
(3, 'Miguelangel', 'M', '2023-05-22', 30681332, 2147483647),
(4, 'Miguelangel', 'M', '2023-05-23', 30681332, 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `estados`
--

CREATE TABLE `estados` (
  `estado_id` int(11) NOT NULL,
  `nombre_estado` varchar(15) NOT NULL,
  `color` varchar(8) NOT NULL,
  `por_defecto` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estados`
--

INSERT INTO `estados` (`estado_id`, `nombre_estado`, `color`, `por_defecto`) VALUES
(1, 'Pendiente', 'BF9A14', 0),
(2, 'Completado', '2CBF14', 1);

-- --------------------------------------------------------

--
-- Table structure for table `formulas`
--

CREATE TABLE `formulas` (
  `formula_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `parte_id` int(11) NOT NULL,
  `esferico_ojo_derecho` float NOT NULL,
  `esferico_ojo_izquierdo` float NOT NULL,
  `cilindro_ojo_derecho` float NOT NULL,
  `cilindro_ojo_izquierdo` float NOT NULL,
  `eje_ojo_derecho` float NOT NULL,
  `eje_ojo_izquierdo` float NOT NULL,
  `adicion_ojo_derecho` float NOT NULL,
  `adicion_ojo_izquierdo` float NOT NULL,
  `distancia_pupilar` float NOT NULL,
  `es_progresivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `formulas`
--

INSERT INTO `formulas` (`formula_id`, `cliente_id`, `parte_id`, `esferico_ojo_derecho`, `esferico_ojo_izquierdo`, `cilindro_ojo_derecho`, `cilindro_ojo_izquierdo`, `eje_ojo_derecho`, `eje_ojo_izquierdo`, `adicion_ojo_derecho`, `adicion_ojo_izquierdo`, `distancia_pupilar`, `es_progresivo`) VALUES
(1, 1, 0, 12, 12, 12, 12, 1212, 12, 12, 12, 12, 0),
(2, 2, 0, 1, 1, 1, 1, 1, 1, 1, -1, 5, 0),
(3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 11, 1, 0),
(4, 4, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lentes`
--

CREATE TABLE `lentes` (
  `lente_id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `estado_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lentes`
--

INSERT INTO `lentes` (`lente_id`, `venta_id`, `estado_id`) VALUES
(1, 1, 2),
(2, 3, 2),
(3, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `pago_id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `metodo_pago` varchar(20) NOT NULL,
  `referencia` int(11) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pagos`
--

INSERT INTO `pagos` (`pago_id`, `venta_id`, `cantidad`, `metodo_pago`, `referencia`, `fecha`) VALUES
(1, 1, 100, 'Pago Movil', 0, '2023-05-21'),
(2, 2, 400, 'Pago Movil', 0, '2023-05-22'),
(3, 3, 123, 'Pago Movil', 0, '2023-05-22'),
(4, 4, 123, 'Pago Movil', 0, '2023-05-22');

-- --------------------------------------------------------

--
-- Table structure for table `parte_lentes`
--

CREATE TABLE `parte_lentes` (
  `parte_lentes_id` int(11) NOT NULL,
  `lente_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `precio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parte_lentes`
--

INSERT INTO `parte_lentes` (`parte_lentes_id`, `lente_id`, `producto_id`, `precio`) VALUES
(1, 1, 1, 200),
(2, 1, 2, 200),
(3, 1, 3, 200),
(4, 2, 2, 200),
(5, 2, 1, 200),
(6, 2, 3, 200),
(7, 3, 1, 500),
(8, 3, 2, 500),
(9, 3, 3, 500);

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL,
  `necesita_formula` tinyint(1) NOT NULL DEFAULT 0,
  `pertenece_lente` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `necesita_formula`, `pertenece_lente`) VALUES
(1, 'Cristal', 1, 1),
(2, 'Montura', 0, 1),
(3, 'Consulta', 1, 0),
(4, 'Reparación', 0, 0),
(5, 'Lentes', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nombres` varchar(60) NOT NULL,
  `nombre_usuario` varchar(25) NOT NULL,
  `correo` varchar(40) NOT NULL,
  `rol` varchar(15) NOT NULL DEFAULT 'USUARIOS',
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombres`, `nombre_usuario`, `correo`, `rol`, `password`) VALUES
(1, 'Miguelangel', 'miguel', 'miguelangel.dgonzalez@gmail.com', 'ADMINISTRADOR', 'asdf123456'),
(3, 'Raul', 'raul', 'raul@gmail.com', 'USUARIO', 'asdf123456');

-- --------------------------------------------------------

--
-- Table structure for table `ventas`
--

CREATE TABLE `ventas` (
  `venta_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ventas`
--

INSERT INTO `ventas` (`venta_id`, `cliente_id`, `fecha`) VALUES
(1, 1, '2023-05-21'),
(2, 2, '2023-05-22'),
(3, 3, '2023-05-22'),
(4, 4, '2023-05-22');

-- --------------------------------------------------------

--
-- Table structure for table `ventas_productos`
--

CREATE TABLE `ventas_productos` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `precio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ventas_productos`
--

INSERT INTO `ventas_productos` (`id`, `venta_id`, `producto_id`, `precio`) VALUES
(1, 2, 3, 500),
(2, 2, 1, 500);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`);

--
-- Indexes for table `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`estado_id`);

--
-- Indexes for table `formulas`
--
ALTER TABLE `formulas`
  ADD PRIMARY KEY (`formula_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indexes for table `lentes`
--
ALTER TABLE `lentes`
  ADD PRIMARY KEY (`lente_id`),
  ADD KEY `lentes_ibfk_1` (`estado_id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`pago_id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- Indexes for table `parte_lentes`
--
ALTER TABLE `parte_lentes`
  ADD PRIMARY KEY (`parte_lentes_id`),
  ADD KEY `lente_id` (`lente_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`producto_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`,`correo`);

--
-- Indexes for table `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`venta_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indexes for table `ventas_productos`
--
ALTER TABLE `ventas_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `venta_id` (`venta_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `estados`
--
ALTER TABLE `estados`
  MODIFY `estado_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `formulas`
--
ALTER TABLE `formulas`
  MODIFY `formula_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lentes`
--
ALTER TABLE `lentes`
  MODIFY `lente_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `pago_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `parte_lentes`
--
ALTER TABLE `parte_lentes`
  MODIFY `parte_lentes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `producto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ventas`
--
ALTER TABLE `ventas`
  MODIFY `venta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ventas_productos`
--
ALTER TABLE `ventas_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `formulas`
--
ALTER TABLE `formulas`
  ADD CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`) ON DELETE CASCADE;

--
-- Constraints for table `lentes`
--
ALTER TABLE `lentes`
  ADD CONSTRAINT `lentes_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`estado_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lentes_ibfk_2` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE;

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE;

--
-- Constraints for table `parte_lentes`
--
ALTER TABLE `parte_lentes`
  ADD CONSTRAINT `parte_lentes_ibfk_1` FOREIGN KEY (`lente_id`) REFERENCES `lentes` (`lente_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parte_lentes_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE CASCADE;

--
-- Constraints for table `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`) ON DELETE CASCADE;

--
-- Constraints for table `ventas_productos`
--
ALTER TABLE `ventas_productos`
  ADD CONSTRAINT `ventas_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ventas_productos_ibfk_2` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
