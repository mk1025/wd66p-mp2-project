<?php

const SERVER_NAME = "localhost";
const USERNAME = "root";
const PASSWORD = "";
const DB_NAME = "wd66p_mp2";

$connection = new mysqli(SERVER_NAME, USERNAME, PASSWORD, DB_NAME);


if($connection->connect_error) {
    
    $returnJSON = ["status" => "db_conn_error", "message" => $connection->connect_error];
    echo json_encode($returnJSON, JSON_PRETTY_PRINT);
    exit();
}


if(isset($_POST['reg'])) {
    $postData = json_decode($_POST['reg']);

    $tableName = "users";

    $DB_NAME = DB_NAME;

    $checkTableSQL = "SELECT 1 FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name = '$tableName' LIMIT 1";

    $result = $connection->query($checkTableSQL);

    if($result && $result -> num_rows > 0) {
        createNewUser($postData, $tableName);
        
    } else {
        $createTableSQL = "CREATE TABLE $tableName (
            `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
            uid VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

        if($connection -> query($createTableSQL)) {
            http_response_code(201);
            $returnJSON = ["status" => "db_table_created", "message" => $connection->error];
            echo json_encode($returnJSON);
            exit();
        } else {
            http_response_code(400);
            $returnJSON = ["status" => "db_table_error", "message" => $connection->error];
            echo json_encode($returnJSON);
            exit();
        }
    }
}

function searchUsername($data) {
    global $connection;
    $checkUsername = "SELECT 1 FROM users WHERE username = '$data'";
    $result = $connection->query($checkUsername);
    if($result && $result -> num_rows > 0) {
        return true;
    }
    return false;

}

function searchEmail($data) {
    global $connection;
    $checkEmail = "SELECT 1 FROM users WHERE email = '$data'";
    $result = $connection->query($checkEmail);
    if($result && $result -> num_rows > 0) {
        return true;
    }
    return false;
}

function createNewUser($newData ,$table) {
    global $connection;
if(searchUsername($newData->username)) {
            http_response_code(400);
            $returnJSON = ["status" => "username_exists", "message" => "Username already exists"];
            echo json_encode($returnJSON, JSON_PRETTY_PRINT);
            exit();
        }
        if (searchEmail($newData->email_address)) {
            http_response_code(400);
            $returnJSON = ["status" => "email_exists", "message" => "Email already exists"];
            echo json_encode($returnJSON, JSON_PRETTY_PRINT);
            exit();
        }

        $email = $newData->email_address;
        $username = $newData->username;

        $password = $newData->password;
        $password = password_hash($password, PASSWORD_ARGON2I);

        $first_name = $newData->first_name;
        $last_name = $newData->last_name;

        $image = $newData->image;

        do {
            $newUID = substr(generateUID(10), 0, 6) . "-" . substr(generateUID(10), 0, 6);
            $checkUIDSQL = "SELECT 1 FROM $table WHERE uid = '$newUID'";
            $result = $connection->query($checkUIDSQL);
        } while ($result && $result -> num_rows > 0);
        

        $addUserSQL = "INSERT INTO $table (uid, first_name, last_name, username, password, email, image, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";

        $stmt = $connection->prepare($addUserSQL);

        $stmt->bind_param("ssssss", $newUID, $first_name, $last_name, $username, $password, $email, $image);

        if ($connection -> query($addUserSQL)) {
            http_response_code(201);
            $returnJSON = ["status" => "db_table_created", "message" => "user added"];
            echo json_encode($returnJSON);
            exit();
        } else {
            http_response_code(400);
            $returnJSON = ["status" => "db_table_error", "message" => $connection->error];
            echo json_encode($returnJSON);
            exit();
        }
}


function generateUID($length) {
    $characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $sequence = '';

    for ($i = 0; $i < $length; $i++) {
        $randomIndex = mt_rand(0, strlen($characters) - 1);
        $sequence .= $characters[$randomIndex];
    }

    return $sequence;
}
