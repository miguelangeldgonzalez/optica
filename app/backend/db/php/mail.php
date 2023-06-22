<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require('./phpMailer/src/PHPMailer.php');
require('./phpMailer/src/Exception.php');
require('./phpMailer/src/SMTP.php');
require('./link.php');

$query = "SELECT * FROM configuraciones WHERE name = 'EMAIL'";

$email = mysqli_query($LINK, $query);
$email = $email->fetch_all(MYSQLI_ASSOC);
$email = $email[0]['value'];

$query = "SELECT * FROM configuraciones WHERE name = 'EMAIL_CODE'";

$email_code = mysqli_query($LINK, $query);
$email_code = $email_code->fetch_all(MYSQLI_ASSOC);
$email_code = $email_code[0]['value'];


$_POST = json_decode(trim(file_get_contents("php://input")), true);



$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->SMTPAuth = true;
$mail->Username = $email;
$mail->Password = $email_code;

$mail->setFrom($email, 'Sistema Automatico de Optiluz');
$mail->addAddress($_POST['correo']);
$mail->Subject = 'Recuperacion de contraseña';
$mail->Body = 'Utiliza este codigo temporal como contraseña, una vez que inicies, tendrás que cambiarlo: '. $_POST['temporal_password'];

if ($mail->send()) {
    echo 'true';
} else {
    echo 'false';
}


?>