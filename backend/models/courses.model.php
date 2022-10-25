<?php

class Courses extends Model {
    function __construct() {
        $columns = [
            new ColumnProperties(
                "id",
                Types::NUMBER,
                5,
                true,
                true
            ),
            new ColumnProperties(
                "name",
                Types::STRING
            ),
            new ColumnProperties(
                "professor",
                Types::NUMBER
            )
        ];

        parent::__construct("courses", ...$columns);
        
    }
}

?>