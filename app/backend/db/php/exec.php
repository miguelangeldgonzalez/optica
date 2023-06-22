<?php

require('./link.php');

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}

$_POST = json_decode(trim(file_get_contents("php://input")), true);

$query = '';
$result;

if(array_key_exists('query', $_POST)) $query = $_POST['query'];
try {
    $result = mysqli_query($LINK, $query);
    
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
            $pk = mysqli_insert_id($LINK);   
            $where = "$primary_key = $pk";
        }

        $result = mysqli_query($LINK, "SELECT * FROM $table_name WHERE $where");
    }
    
    if (!array_key_exists('delete', $_POST)) {
        $result = $result->fetch_all(MYSQLI_ASSOC);
    }

    print_r(json_encode(utf8ize($result)));

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