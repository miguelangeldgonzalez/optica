<?php

class Users extends Model {
    function __construct() {
        $columns = [
                new ColumnProperties(
                    "id",
                    Types::NUMBER,
                    4,
                    true,
                    true
                ),
                new ColumnProperties(
                    'name',
                    Types::STRING
                )
            ];

        parent::__construct('users', ...$columns);
    }

    function associate() {
        $this->has_one(new Courses(), "courses", "id", "professor");
    }
}


?>