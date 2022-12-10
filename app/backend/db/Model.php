<?php

$password = '';
$username = 'root';
$host = 'localhost';
$dbname = 'project';

$connection = new mysqli($host, $username, $password);

mysqli_query($connection, 'CREATE DATABASE IF NOT EXISTS '.$dbname);

define('LINK', new mysqli($host, $username, $password, $dbname));

enum Types: string {
    case STRING = 'VARCHAR';
    case NUMBER = 'INTEGER';
}

class ColumnProperties {
    function __construct(
        public $name, 
        public Types $type,
        public $length = 15, 
        public $primary_key = false,
        public $auto_increment = false
        ){
        
        # Validaciones de tipado
        if(gettype($name) !== 'string') throw new Exception('El parametro name debe ser de tipo string');
        if(gettype($length) !== 'integer') throw new Exception('El parametro length debe ser de tipo int');
        if(gettype($primary_key) !== 'boolean') throw new Exception('El parametro primary_key debe ser de tipo bool');
        if(gettype($auto_increment) !== 'boolean') throw new Exception('El parametro auto_increment debe ser de tipo bool');

        # Validaciones de bases de datos
        if($type == Types::STRING && $auto_increment) throw new Exception('El tipo string no puede ser incrementable');
    }
}

class QueryResult {
    function __construct(
        public array $result,
        public string $query_type,
        public string $query
    ) {}
}

class Model {
    private $columns;
    private $table_name;
    private $primary_key;
    private $columns_names;
    
    private $associations = [];

    private $search_logic_operators = ['OR', 'AND', 'IN'];

    function __construct(String $table_name, ColumnProperties ...$columns) {
       $this->table_name = $table_name;
       $this->columns = $columns;
       $this->columns_names = [];
       $this->primary_key = null;

       $this->verify_columns();

       if(!$this->table_exists()) {
           $this->init();
       }
    }

    private function verify_columns() {
        for($i = 0; $i < count($this->columns); $i++) {
            array_push($this->columns_names, $this->columns[$i]->name);

            if($this->columns[$i]->primary_key) {
                $this->primary_key = $this->columns[$i];
            }
        }

        if($this->primary_key == null) {
            throw new Exception('No se encontró una llave primaria');
        }
    }
    
    private function table_exists() {
        try {
            mysqli_query(LINK, 'SELECT * FROM '.$this->table_name);
            return true;
        }catch (Exception $e) {
            return false;
        }
        
    }

    private function init() {
        $query = 'CREATE TABLE IF NOT EXISTS '.$this->table_name.' (';

        foreach($this->columns as $column) {
            $query .= $column->name . ' ' . $column->type->value . '('. $column->length .')';
            
            if($column->auto_increment == true) {
                $query .= ' AUTO_INCREMENT, ';
            } else {
               $query .= ', ';
            }
        }

        $query = substr($query, 0, -2);
        $query .= ', PRIMARY KEY ('.$this->primary_key->name.') );';
        
        mysqli_query(LINK, $query);
    }

    private function exec_result(string $query, string $query_type = 'SELECT', mixed $pk = null) {
        $result;
        switch($query_type) {
            case 'SELECT':
                $result = mysqli_query(LINK, $query);
                break;
            case 'CREATE':
            case 'UPDATE':
                mysqli_query(LINK, $query);

                if($query_type == 'CREATE') $pk = mysqli_insert_id(LINK);
                if($this->primary_key->type == Types::STRING) $pk = "'$pk'";
                
                $result = mysqli_query(LINK, "SELECT * FROM $this->table_name WHERE " . $this->primary_key->name ." = $pk");
                
                break;
        }

        return new QueryResult($result->fetch_all(MYSQLI_ASSOC), $query_type, $query);
    }

    private function adjust_where($where_options) {
        foreach($where_options as $key=>$value) {
            
        }
    }

    protected function has_one(Model $model, string $alias, string $self_key, string $foreign_key){
        array_push($this->associations, [
            $alias => [
                "model" => $model,
                "self_key" => $self_key,
                "foreign_key" => $foreign_key
            ]
        ]);
    }

    function create($data) {
        $query = 'INSERT INTO '.$this->table_name.' (';

        foreach($data as $key=>$value) {
            if(in_array($key, $this->columns_names)) {
                $query .= '`'.$key.'`,';
            }
        }

        $query = substr($query, 0, -1);
        $query .= ') VALUES (';

        foreach($data as $key=>$value) {
            if(in_array($key, $this->columns_names)) {
                $query .= "'".$value."',";
            }
        }

        $query = substr($query, 0, -1);
        $query .= ');';

        return $this->exec_result($query, 'CREATE');
    }

    function update(mixed $pk, array $changes) {
        $query = 'UPDATE '.$this->table_name.' SET ';

        foreach($changes as $column=>$value) {
            if(in_array($column, $this->columns_names)) {
                $query .= "`$column`='$value', ";
            }
        }

        $query = substr($query, 0, -2);

        $query .= " WHERE ".$this->primary_key->name. " = ".$pk;

        return $this->exec_result($query, 'UPDATE', $pk);
    }

    function find_all($query_options = []) {
        $columns_queried = '*';

        if(array_key_exists('exclude', $query_options)) {
            $columns_queried = '';
            if(gettype($query_options['exclude']) == 'string') $query_options['exclude'] = [$query_options['exclude']];

            foreach($query_options['exclude'] as $excluded) {
                foreach($this->columns_names as $column) {
                    if($excluded != $column) {
                        $columns_queried .= "`$column`, ";
                    }
                }
            }

            $columns_queried = substr($columns_queried, 0, -2);
        }

        $query = "SELECT $columns_queried FROM ".$this->table_name;


        if(array_key_exists('where', $query_options)) {
            $query .= " WHERE " . $this->adjust_where($query_options);
        }


        if(array_key_exists('where', $query_options)) $query .= ' WHERE '. $query_options['where'];

        return $this->exec_result($query);
    }
} 

?>