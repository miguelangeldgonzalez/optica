<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        html {
            background-color: black;
            color: white
        }
    </style>
</head>
<body>
    
    <?php

    require('./backend/models/_index.php');

    $option = [
        "exclude" => "id"
    ];

    print_r(json_encode($users->find_all($option)));
    ?>
</body>
</html>