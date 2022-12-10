<?php

require('./link.php');

$query = '';

if(array_key_exists('query', $_POST)) $query = $_POST['query'];

try {
    $result = mysqli_query(LINK, $query);
    
    //Si la consulta es de tipo INSERT, UPDATE o DELETE
    //entonces busca el último id insertado, para esto necesita
    //el nombre de la tabla y la llave primaria
    if(array_key_exists('table_name', $_POST)){
        $table_name = $_POST['table_name'];
        $primary_key = $_POST['primary_key'];

        if($table_name == '[object Object]') throw new Exception('El nombre de la tabla debe ser de tipo string');
        if($primary_key == '[object Object]') throw new Exception('La llave primaria debe ser de tipo string');

        $where = '';

        if(array_key_exists('where', $_POST)) {
            $where = $_POST['where'];
        } else {
            $pk = mysqli_affected_rows(LINK);
            $where = "$primary_key = $pk";
        }

        $result = mysqli_query(LINK, "SELECT * FROM $table_name WHERE $where");
    }
    
    $result = $result->fetch_all(MYSQLI_ASSOC);
    print_r(json_encode($result));

} catch (ValueError | Exception $e) {
    $result = [
        "error" => $e->getMessage()
    ];

    print_r(json_encode($result));
} catch (mysqli_sql_exception $e) {
    $result = [
        "error" => $e->getMessage(),
        "query" => $query
    ];

    print_r(json_encode($result));
}
?>