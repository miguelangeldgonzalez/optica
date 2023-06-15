<?php
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

if (password_verify($_POST['password'], $_POST['password_crypted'])) {
    echo true;
} else {
    echo false;
}

?>