<?php

require(__DIR__ . '/../db/Model.php');

require(__DIR__ . './courses.model.php');
require(__DIR__ . './users.model.php');

$courses = new Courses();
$users = new Users();

$users->associate();

?>