
START TRANSACTION;

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
(1, 'Miguelangel', 'M', '2023-05-08', 30681332, 2147483647),
(2, 'Amaru', 'F', '2023-05-08', 30681332, 0),
(3, 'asd', 'M', '2023-05-17', 30681332, 2147483647),
(4, 'Miguelangel', 'M', '2023-05-16', 30681332, 2147483647);

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
(1, 0, 0, 12, 1, 12, 2, 12, 12, 12, 12, 2, 0),
(2, 0, 0, 12, 1, 12, 2, 12, 12, 12, 12, 2, 0),
(3, 0, 0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 0),
(4, 0, 0, 12, 12, 12, 1, 12, 21, 12, 21, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lentes`
--

CREATE TABLE `lentes` (
  `lente_id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lentes`
--

INSERT INTO `lentes` (`lente_id`, `venta_id`) VALUES
(1, 0),
(2, 0),
(3, 0);

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
(1, 0, 25, 'Pago Movil', 0, '2023-05-09'),
(2, 0, 123, 'Pago Movil', 0, '2023-05-09'),
(3, 0, 12, 'Pago Movil', 0, '2023-05-09');

-- --------------------------------------------------------

--
-- Table structure for table `parte_lentes`
--

CREATE TABLE `parte_lentes` (
  `parte_lentes_id` int(11) NOT NULL,
  `lente_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parte_lentes`
--

INSERT INTO `parte_lentes` (`parte_lentes_id`, `lente_id`, `producto_id`) VALUES
(1, 0, 1),
(2, 0, 2),
(3, 0, 3),
(4, 0, 1),
(5, 0, 2),
(6, 0, 3),
(7, 0, 1),
(8, 0, 3),
(9, 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL,
  `necesita_formula` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `necesita_formula`) VALUES
(1, 'Cristal', 1),
(2, 'Montura', 0),
(3, 'Consulta', 1),
(4, 'Reparación', 0),
(5, 'Lentes', 0);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nombres` varchar(60) NOT NULL,
  `nombre_usuario` varchar(25) NOT NULL,
  `correo` varchar(40) NOT NULL,
  `rol` varchar(15) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombres`, `nombre_usuario`, `correo`, `rol`, `password`) VALUES
(1, 'Miguelangel', 'miguel', 'miguelangel.dgonzalez@gmail.com', 'ADMINISTRADOR', 'asdf123456');

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
(1, 0, '2023-05-09'),
(2, 0, '2023-05-09'),
(3, 0, '2023-05-09');

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
(1, 0, 3, 500),
(2, 0, 3, 500),
(3, 0, 3, 200),
(4, 0, 4, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`cliente_id`);

--
-- Indexes for table `formulas`
--
ALTER TABLE `formulas`
  ADD PRIMARY KEY (`formula_id`);

--
-- Indexes for table `lentes`
--
ALTER TABLE `lentes`
  ADD PRIMARY KEY (`lente_id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`pago_id`);

--
-- Indexes for table `parte_lentes`
--
ALTER TABLE `parte_lentes`
  ADD PRIMARY KEY (`parte_lentes_id`);

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
  ADD PRIMARY KEY (`venta_id`);

--
-- Indexes for table `ventas_productos`
--
ALTER TABLE `ventas_productos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `cliente_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `pago_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ventas`
--
ALTER TABLE `ventas`
  MODIFY `venta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ventas_productos`
--
ALTER TABLE `ventas_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
