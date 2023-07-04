<?php


$jsonData = file_get_contents("php://input", true);

$data = json_decode($jsonData, true);

echo $data['email_address'];

echo json_encode($_POST, JSON_PRETTY_PRINT);