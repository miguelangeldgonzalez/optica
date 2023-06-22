CREATE TABLE `productos` (   `producto_id` int(11) NOT NULL AUTO_INCREMENT,   `nombre` varchar(15) NOT NULL,   `necesita_formula` tinyint(1) NOT NULL DEFAULT 0,   `pertenece_lente` tinyint(4) NOT NULL,   PRIMARY KEY (`producto_id`) ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO productos VALUES("1","Cristal","1","1"),("2","Montura","0","1"),("3","Consulta","1","0"),("4","Reparación","0","0"),("5","Lentes","0","0");CREATE TABLE `clientes` (   `cliente_id` int(11) NOT NULL AUTO_INCREMENT,   `nombres` varchar(55) NOT NULL,   `sexo` text NOT NULL,   `fecha_nacimiento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),   `cedula` int(11) NOT NULL,   `telefono` int(11) NOT NULL,   `fecha` timestamp NOT NULL DEFAULT current_timestamp(),   PRIMARY KEY (`cliente_id`),   UNIQUE KEY `cedula` (`cedula`) ) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO clientes VALUES("14","Marco Peralta","M","2023-06-03 16:00:00","24252627","123456789","2023-06-13 16:06:00"),("24","Maria Eugenia","F","2023-06-11 16:00:00","123456789","456461212","2023-06-14 14:47:36"),("25","Florencia","M","2023-06-19 16:00:00","1597894251","459456123","2023-06-14 16:15:23"),("26","Juana","M","2023-06-12 16:00:00","45894746","12392382","2023-06-14 22:47:53"),("27","Lucas","M","2023-06-10 16:00:00","30681332","192827364","2023-06-14 22:53:19");CREATE TABLE `estados` (   `estado_id` int(11) NOT NULL AUTO_INCREMENT,   `nombre_estado` varchar(15) NOT NULL,   `color` varchar(8) NOT NULL,   `por_defecto` tinyint(4) NOT NULL,   PRIMARY KEY (`estado_id`) ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO estados VALUES("1","Pendiente","BF9A14","1"),("2","Completado","2CBF14","0");CREATE TABLE `formulas` (   `formula_id` int(11) NOT NULL AUTO_INCREMENT,   `cliente_id` int(11) NOT NULL,   `esferico_ojo_derecho` float NOT NULL,   `esferico_ojo_izquierdo` float NOT NULL,   `cilindro_ojo_derecho` float NOT NULL,   `cilindro_ojo_izquierdo` float NOT NULL,   `eje_ojo_derecho` float NOT NULL,   `eje_ojo_izquierdo` float NOT NULL,   `adicion_ojo_derecho` float NOT NULL,   `adicion_ojo_izquierdo` float NOT NULL,   `distancia_pupilar` float NOT NULL,   `es_progresivo` tinyint(1) NOT NULL,   `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),   PRIMARY KEY (`formula_id`),   KEY `cliente_id` (`cliente_id`),   CONSTRAINT `formulas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`) ON DELETE CASCADE ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO formulas VALUES("1","14","12","2","12","2","1","2","2","2","2","0","2023-06-14 03:12:05"),("3","24","1","1","1","1","1","1","1","1","1","0","2023-06-14 14:47:36"),("4","25","1","1","4","2","5","5","6","4","1","0","2023-06-14 16:15:23"),("5","26","1","1","1","11","1","1","1","1","1","0","2023-06-14 22:47:53"),("6","27","1","1","1","1","1","1","11","1","1","0","2023-06-14 22:53:19");CREATE TABLE `ventas` (   `venta_id` int(11) NOT NULL AUTO_INCREMENT,   `cliente_id` int(11) NOT NULL,   `fecha` timestamp NOT NULL DEFAULT current_timestamp(),   PRIMARY KEY (`venta_id`),   KEY `cliente_id` (`cliente_id`),   CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`) ON DELETE CASCADE ) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO ventas VALUES("31","27","2023-06-21 05:25:45"),("32","27","2023-06-21 05:29:15"),("33","27","2023-06-21 05:39:08"),("34","27","2023-06-21 05:45:01"),("35","27","2023-06-21 05:45:01"),("38","27","2023-06-21 06:55:47"),("40","27","2023-06-21 07:08:23");CREATE TABLE `pagos` (   `pago_id` int(11) NOT NULL AUTO_INCREMENT,   `venta_id` int(11) NOT NULL,   `cantidad` int(11) NOT NULL,   `metodo_pago` varchar(20) NOT NULL,   `referencia` int(11) NOT NULL,   `fecha` date NOT NULL DEFAULT current_timestamp(),   PRIMARY KEY (`pago_id`),   KEY `venta_id` (`venta_id`),   CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE ) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO pagos VALUES("36","40","12","Pago Movil","0","2023-06-21");CREATE TABLE `lentes` (   `lente_id` int(11) NOT NULL AUTO_INCREMENT,   `venta_id` int(11) NOT NULL,   `estado_id` int(11) NOT NULL,   PRIMARY KEY (`lente_id`),   KEY `lentes_ibfk_1` (`estado_id`),   KEY `venta_id` (`venta_id`),   CONSTRAINT `lentes_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`estado_id`) ON DELETE CASCADE,   CONSTRAINT `lentes_ibfk_2` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE ) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO lentes VALUES("17","31","2"),("18","31","2"),("19","32","2"),("20","32","2"),("21","33","2"),("22","33","2"),("23","34","2"),("24","35","2"),("25","34","2"),("26","35","2");CREATE TABLE `parte_lentes` (   `parte_lentes_id` int(11) NOT NULL AUTO_INCREMENT,   `lente_id` int(11) NOT NULL,   `producto_id` int(11) NOT NULL,   `estado_id` int(11) NOT NULL DEFAULT 2,   `precio` int(11) NOT NULL,   PRIMARY KEY (`parte_lentes_id`),   KEY `lente_id` (`lente_id`),   KEY `producto_id` (`producto_id`),   KEY `estado_id` (`estado_id`),   CONSTRAINT `parte_lentes_ibfk_1` FOREIGN KEY (`lente_id`) REFERENCES `lentes` (`lente_id`) ON DELETE CASCADE,   CONSTRAINT `parte_lentes_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE CASCADE,   CONSTRAINT `parte_lentes_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`estado_id`) ON DELETE NO ACTION ) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO parte_lentes VALUES("24","17","1","1","12"),("25","17","2","2","12"),("26","18","1","1","12"),("27","18","2","2","12"),("28","19","1","1","12"),("29","19","2","2","12"),("30","20","1","1","12"),("31","20","2","2","12"),("32","21","1","1","12"),("33","21","2","2","12"),("34","22","1","1","12"),("35","22","2","2","12"),("36","23","1","1","12"),("37","23","2","2","12"),("38","25","1","1","12"),("39","24","1","1","12"),("40","25","2","2","12"),("41","24","2","2","12"),("42","26","1","1","12"),("43","26","2","2","12");CREATE TABLE `ventas_productos` (   `ventas_productos_id` int(11) NOT NULL AUTO_INCREMENT,   `venta_id` int(11) NOT NULL,   `producto_id` int(11) NOT NULL,   `estado_id` int(11) NOT NULL DEFAULT 2,   `precio` int(11) NOT NULL,   PRIMARY KEY (`ventas_productos_id`),   KEY `producto_id` (`producto_id`),   KEY `venta_id` (`venta_id`),   KEY `estado_id` (`estado_id`),   CONSTRAINT `ventas_productos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE CASCADE,   CONSTRAINT `ventas_productos_ibfk_2` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`venta_id`) ON DELETE CASCADE,   CONSTRAINT `ventas_productos_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`estado_id`) ) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO ventas_productos VALUES("27","31","1","1","12"),("28","31","1","1","12"),("29","32","1","1","12"),("30","32","1","1","12"),("31","33","1","1","12"),("32","33","1","1","12"),("33","34","1","1","12"),("34","34","1","1","12"),("35","35","1","1","12"),("36","35","1","1","12"),("41","38","1","1","12"),("42","38","1","1","12"),("45","40","1","1","12"),("46","40","1","1","12");CREATE TABLE `partes_formulas` (   `partes_formulas_id` int(11) NOT NULL AUTO_INCREMENT,   `formula_id` int(11) NOT NULL,   `parte_lentes_id` int(11) DEFAULT NULL,   `ventas_productos_id` int(11) DEFAULT NULL,   PRIMARY KEY (`partes_formulas_id`),   KEY `formula_id` (`formula_id`),   KEY `parte_lentes_id` (`parte_lentes_id`),   KEY `ventas_productos_id` (`ventas_productos_id`),   CONSTRAINT `partes_formulas_ibfk_1` FOREIGN KEY (`formula_id`) REFERENCES `formulas` (`formula_id`) ON DELETE CASCADE ON UPDATE NO ACTION,   CONSTRAINT `partes_formulas_ibfk_2` FOREIGN KEY (`parte_lentes_id`) REFERENCES `parte_lentes` (`parte_lentes_id`) ON DELETE CASCADE,   CONSTRAINT `partes_formulas_ibfk_3` FOREIGN KEY (`ventas_productos_id`) REFERENCES `ventas_productos` (`ventas_productos_id`) ON DELETE CASCADE ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO partes_formulas VALUES("5","6",NULL,"41"),("8","6",NULL,"45"),("9","1",NULL,"46");CREATE TABLE `usuarios` (   `usuario_id` int(11) NOT NULL AUTO_INCREMENT,   `nombres` varchar(60) NOT NULL,   `nombre_usuario` varchar(25) NOT NULL,   `correo` varchar(40) NOT NULL,   `rol` varchar(15) NOT NULL DEFAULT 'USUARIOS',   `password` varchar(255) NOT NULL,   PRIMARY KEY (`usuario_id`),   UNIQUE KEY `nombre_usuario` (`nombre_usuario`,`correo`) ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;INSERT INTO usuarios VALUES("1","Miguelangel","miguel","miguelangel.dgonzalez@gmail.com","ADMINISTRADOR","$2y$10$i9gaeCc5SgocWEOQREpaDONcYd9YcByRGQJTVB4AHKNUefVzNTQQq"),("3","Raul","raul","raul@gmail.com","USUARIO","$2y$10$i9gaeCc5SgocWEOQREpaDONcYd9YcByRGQJTVB4AHKNUefVzNTQQq"),("5","Joaquin","joaquin","jo@gmial.com","USUARIOS","$2y$10$i9gaeCc5SgocWEOQREpaDONcYd9YcByRGQJTVB4AHKNUefVzNTQQq");