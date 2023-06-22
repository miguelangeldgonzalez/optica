<?php
require('./link.php');

function exportarTablas($host, $usuario, $pasword, $nombreDeBaseDeDatos, $LINK) {
    set_time_limit(3000);
    $mysqli = new mysqli($host, $usuario, $pasword, $nombreDeBaseDeDatos);
    $mysqli->select_db($nombreDeBaseDeDatos);
    $mysqli->query("SET NAMES 'utf8'");
    $tablas = $mysqli->query('SHOW TABLES');
    
    //$contenido = "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\r\nSET time_zone = \"+00:00\";\r\n\r\n\r\n/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\r\n/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\r\n/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\r\n/*!40101 SET NAMES utf8 */;\r\n--\r\n-- Database: `" . $nombreDeBaseDeDatos . "`\r\n--\r\n\r\n\r\n";
    $contenido = '';
    $tablasARespaldar = [
        "productos",
        "clientes",
        "estados",
        "formulas",
        "ventas",
        "pagos",
        "lentes",
        "parte_lentes",
        "ventas_productos",
        "partes_formulas",
        "usuarios",
        "configuraciones"
      ];

    foreach ($tablasARespaldar as $nombreDeLaTabla) {
        if (empty($nombreDeLaTabla)) {
            continue;
        }
        $datosQueContieneLaTabla = $mysqli->query('SELECT * FROM `' . $nombreDeLaTabla . '`');
        $cantidadDeCampos = $datosQueContieneLaTabla->field_count;
        $cantidadDeFilas = $mysqli->affected_rows;
        $esquemaDeTabla = $mysqli->query('SHOW CREATE TABLE ' . $nombreDeLaTabla);
        $filaDeTabla = $esquemaDeTabla->fetch_row();
        $contenido .=  str_replace("\n", " ", $filaDeTabla[1]) . ";";
        for ($i = 0, $contador = 0; $i < $cantidadDeCampos; $i++, $contador = 0) {
            while ($fila = $datosQueContieneLaTabla->fetch_row()) {
                //La primera y cada 100 veces
                if ($contador % 100 == 0 || $contador == 0) {
                    $contenido .= "INSERT INTO " . $nombreDeLaTabla . " VALUES";
                }
                $contenido .= "(";
                for ($j = 0; $j < $cantidadDeCampos; $j++) {
                    $fila[$j] = str_replace("\n", " ", addslashes($fila[$j]));
                    if (isset($fila[$j])) {
                        if ($fila[$j] == "") {
                            $contenido .= 'NULL';
                        } else {
                            $contenido .= '"' . $fila[$j] . '"';
                        }
                    } else {
                        $contenido .= '""';
                    }
                    if ($j < ($cantidadDeCampos - 1)) {
                        $contenido .= ',';
                    }
                }
                $contenido .= ")";
                # Cada 100...
                if ((($contador + 1) % 100 == 0 && $contador != 0) || $contador + 1 == $cantidadDeFilas) {
                    $contenido .= ";";
                } else {
                    $contenido .= ",";
                }
                $contador = $contador + 1;
            }
        }
    }
    //$contenido .= "\r\n\r\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\r\n/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\r\n/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;";

    # Se guardará dependiendo del directorio, en una carpeta llamada respaldos
    $carpeta = __DIR__ . "/backup";
    if (!file_exists($carpeta)) {
        mkdir($carpeta);
    }
    date_default_timezone_set('America/La_paz');
    # Calcular un ID único
    $id = date("h.i.s A");

    # También la fecha
    $fecha = date("d-m-Y");

    # Crear un archivo que tendrá un nombre como respaldo_2018-10-22_asd123.sql
    $nombreDelArchivo = sprintf('%s/Respaldo_%s_%s.sql', $carpeta, $fecha, $id);

    #Escribir todo el contenido. Si todo va bien, file_put_contents NO devuelve FALSE
	echo sprintf('Respaldo_%s_%s.sql', $fecha, $id);
    return file_put_contents($nombreDelArchivo, $contenido) !== false;
	
}



exportarTablas($host, $username, $password, $dbname, $LINK);
?>