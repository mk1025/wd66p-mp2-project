<?php

const SERVER_NAME = "localhost";
const USERNAME = "root";
const PASSWORD = "";
const DB_NAME = "wd66p_mp2";

$connection = new mysqli(SERVER_NAME, USERNAME, PASSWORD, DB_NAME);


if ($connection->connect_error) {
    returnResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
}


if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $postData = array(
        "email_address" => $_POST['email_address'],
        "username" => $_POST['username'],
        "password" => $_POST['password'],
        "first_name" => $_POST['first_name'],
        "last_name" => $_POST['last_name']
    );

    $imageFile = $_FILES['image'];
    $postData['image'] = array(
        'name' => $imageFile['name'],
        'type' => $imageFile['type'],
        'tmp_name' => $imageFile['tmp_name'],
        'error' => $imageFile['error'],
        'size' => $imageFile['size']
    );

    $tableName = "users";

    $DB_NAME = DB_NAME;

    $checkTableSQL = "SELECT 1 FROM information_schema.tables
                        WHERE table_schema = '$DB_NAME'
                        AND table_name = '$tableName' LIMIT 1";

    $result = $connection->query($checkTableSQL);

    if ($result && $result->num_rows > 0) {
        createNewUser($postData, $tableName);

    } else {
        $createTableSQL = "CREATE TABLE $tableName (
            `key` INT(11) AUTO_INCREMENT PRIMARY KEY,
            uid VARCHAR(255) NOT NULL UNIQUE,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            image_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

        if ($connection->query($createTableSQL)) {
            // returnResponse(201, "Table Created", "Database Table Created Successfully", "", "");
            createNewUser($postData, $tableName);
        } else {
            returnResponse(400, "Internal Server Error", "Internal Server Error", $connection->error, "");
        }
    }
}

function searchUsername($data)
{
    global $connection;
    $checkUsername = "SELECT 1 FROM users WHERE username = '$data'";
    $result = $connection->query($checkUsername);
    if ($result && $result->num_rows > 0) {
        return true;
    }
    return false;

}

function searchEmail($data)
{
    global $connection;
    $checkEmail = "SELECT 1 FROM users WHERE email = '$data'";
    $result = $connection->query($checkEmail);
    if ($result && $result->num_rows > 0) {
        return true;
    }
    return false;
}

function createNewUser($newData, $table)
{
    global $connection;

    if (searchEmail(strtolower($newData["email_address"]))) {
        returnResponse(409, "Email Error", "Email already exists", "Duplicate email found", "");
    }
    if (searchUsername(strtolower($newData["username"]))) {
        returnResponse(409, "Username Error", "Username already exists", "Duplicate username found", "");
    }


    $email = strtolower($newData["email_address"]);
    $username = strtolower($newData["username"]);

    $password = password_hash($newData["password"], PASSWORD_ARGON2I);

    $first_name = ucwords($newData["first_name"]);
    $last_name = ucwords($newData["last_name"]);


    if (isset($newData["image"])) {
        $imageFile = $newData["image"];
        $imageFileName = $imageFile["name"];

        $targetDirectory = "uploads/";

        if (!is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0755, true);
        }

        $targetFilePath = $targetDirectory . $imageFileName;

        do {
            $newUID = substr(generateUID(10), 0, 6) . "-" . substr(generateUID(10), 0, 6);
            $checkUIDSQL = "SELECT 1 FROM $table WHERE uid = '$newUID'";
            $result = $connection->query($checkUIDSQL);
        } while ($result && $result->num_rows > 0);



        if (move_uploaded_file($imageFile["tmp_name"], $targetFilePath)) {
            $addUserSQL = "INSERT INTO $table (
                uid,
                first_name,
                last_name,
                username,
                password,
                email,
                image_path,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";

            $stmt = $connection->prepare($addUserSQL);

            $stmt->bind_param(
                "sssssss",
                $newUID,
                $first_name,
                $last_name,
                $username,
                $password,
                $email,
                $targetFilePath
            );

            if ($stmt->execute()) {
                returnResponse(201, "Registration Complete", "Log In from the Homepage", "", "");
            } else {
                returnResponse(400, "Registration Failed", "Internal Server Error", $stmt->error, "");
            }
        } else {
            returnResponse(400, "Registration Failed", "Image Upload Failed", "", "");
        }
    } else {
        returnResponse(400, "Registration Failed", "Internal Server Error", "Image Error", "");
    }
}


function generateUID($length)
{
    $characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $sequence = '';

    for ($i = 0; $i < $length; $i++) {
        $randomIndex = random_int(0, strlen($characters) - 1);
        $sequence .= $characters[$randomIndex];
    }

    return $sequence;
}

function returnResponse($status, $title, $message, $description, $data)
{
    http_response_code($status);
    $returnJSON = [
        "status" => $status,
        "title" => $title,
        "message" => $message,
        "description" => $description,
        "data" => $data
    ];
    echo json_encode($returnJSON, JSON_PRETTY_PRINT);
    exit();
}