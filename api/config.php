<?php

include_once "env.php";
include_once "models.php";
include_once "regex.php";
include_once "functions.php";
include_once "functions_db.php";


$connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($connection->connect_errno) {
    http_response_code(400);
    echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
    exit();
}

$query = "SHOW TABLES LIKE '" . TBL_USERS . "'";
$result = $connection->query($query);

if (!$result->num_rows > 0) {
    $createTableSQL = "CREATE TABLE users (
            `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
            uid VARCHAR(13) NOT NULL UNIQUE,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            username VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            image_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

    if (!$connection->query($createTableSQL)) {
        http_response_code(400);
        echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
        exit();
    }
}