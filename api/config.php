<?php

include_once "env.php";

$connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

include_once "models.php";
include_once "regex.php";
include_once "functions.php";
include_once "functions_db.php";



if ($connection->connect_errno) {
    http_response_code(400);
    echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
    $connection->close();
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
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci";

    if (!$connection->query($createTableSQL)) {
        http_response_code(400);
        echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
        $connection->close();
        exit();
    }
}

$query = "SHOW TABLES LIKE '" . TBL_SECTIONS . "'";
$result = $connection->query($query);

if (!$result->num_rows > 0) {
    $createTableSQL = "CREATE TABLE sections (
        `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
        teacher_uid VARCHAR(13) NOT NULL,
        uid VARCHAR(13) NOT NULL UNIQUE,
        section_name VARCHAR(255) NOT NULL,
        sy_start DATE NOT NULL,
        sy_end DATE NOT NULL,
        color VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_uid) REFERENCES users(uid)
    )";

    if (!$connection->query($createTableSQL)) {
        http_response_code(400);
        echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
        $connection->close();
        exit();
    }
}

$query = "SHOW TABLES LIKE '" . TBL_STUDENTS . "'";
$result = $connection->query($query);

if (!$result->num_rows > 0) {
    $createTableSQL = "CREATE TABLE students (
        `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
        section_id VARCHAR(13) NOT NULL,
        uid VARCHAR(13) NOT NULL UNIQUE,
        last_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        birthday DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES sections(uid)
    )";

    if (!$connection->query($createTableSQL)) {
        http_response_code(400);
        echo createResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
        $connection->close();
        exit();
    }
}

/*
    DATABASE WIREFRAME

    For Creating the Subjects Table

    $createTableSQL = "CREATE TABLE subjects (
        `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
        teacher_uid VARCHAR(13) NOT NULL,
        uid VARCHAR(6) NOT NULL UNIQUE,
        subject_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (teacher_uid) REFERENCES users(uid)
    )";


    For Creating the 'Class Records' Table

    $createTableSQL = "CREATE TABLE class_records (
        `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
        teacher_uid VARCHAR(13) NOT NULL,
        subject_uid VARCHAR(6) NOT NULL,
        section_uid VARCHAR(6) NOT NULL,
        uid VARCHAR(6) NOT NULL UNIQUE,
        components JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (teacher_uid) REFERENCES users(uid)
        FOREIGN KEY (subject_uid) REFERENCES subjects(uid)
        FOREIGN KEY (section_uid) REFERENCES sections(uid)
    )";


    For Creating the Activities (for Subjects) Table

    $createTableSQL = "CREATE TABLE activities (
        `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
        teacher_uid VARCHAR(13) NOT NULL,
        subject_uid VARCHAR(6) NOT NULL,
        uid VARCHAR(6) NOT NULL UNIQUE,
        activity_name VARCHAR(255) NOT NULL,
        activity_type VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (teacher_uid) REFERENCES users(uid)
        FOREIGN KEY (subject_uid) REFERENCES subjects(uid)
    )";
        


*/