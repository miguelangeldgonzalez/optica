<?php

$arrFiles = array();
$handle = opendir( __DIR__ . "/backup");
if ($handle) {
    while (($entry = readdir($handle)) !== FALSE) {
        $arrFiles[] = $entry;
    }
}
closedir($handle);

print_r(json_encode($arrFiles));


?>