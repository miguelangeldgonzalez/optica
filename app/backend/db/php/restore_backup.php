<?php

include('./link.php');

$_POST = json_decode(trim(file_get_contents("php://input")), true);


$tables = [
    "usuarios",
    "partes_formulas",
    "parte_lentes",
    "ventas_productos",
    "lentes",
    "pagos",
    "ventas",
    "formulas",
    "estados",
    "clientes",
    "productos",
    "configuraciones"
];

foreach ($tables as $table) {
    echo $table;
    mysqli_query($LINK, 'DROP TABLE ' . $table);
}

// Abriendo el archivo
$archivo = fopen(__DIR__ . "/backup\/" . $_POST['file'] , "r");
$query = '';
 
// Recorremos todas las lineas del archivo
while(!feof($archivo)){
    // Leyendo una linea
    $traer = fgets($archivo);
    // Imprimiendo una linea
    $query .= $traer;
}
 
// Cerrando el archivo
fclose($archivo);

$commands = explode(';', $query);
foreach ($commands as $command) {
    print_r($command);
    echo '<br>';
    mysqli_query($LINK, $command);
}

?>