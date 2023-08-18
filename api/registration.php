<?php

include_once "config.php";


if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $postData = array(
        "email_address" => $_POST['email_address'],
        "username" => $_POST['username'],
        "password" => $_POST['password'],
        "confirm_password" => $_POST['confirm_password'],
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

    if (validateData($postData)) {
        createNewUser($postData);
    }
    $connection->close();
    exit();
}

function validateData($data)
{
    $errors = [];

    if (!preg_match(REGEX_EMAIL, $data['email_address'])) {
        $errors[] = "Email is not valid";
    }
    if (!preg_match(REGEX_USERNAME, $data['username'])) {
        $errors[] = "Username is not valid";
    }
    if ($data['password'] !== $data['confirm_password']) {
        $errors[] = "Passwords do not match";
    }
    if (!preg_match(REGEX_PASSWORD, $data['password'])) {
        $errors[] = "Password is not valid";
    }
    if (!preg_match(REGEX_PASSWORD, $data['confirm_password'])) {
        $errors[] = "Confirm Password is not valid";
    }
    if (!preg_match(REGEX_NAMES, $data['first_name'])) {
        $errors[] = "First Name is not valid";
    }
    if (!preg_match(REGEX_NAMES, $data['last_name'])) {
        $errors[] = "Last Name is not valid";
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", implode(", ", $errors), "", "");
        return false;
    }

    return true;
}

function createNewUser($data)
{
    global $connection;

    if (queryOneRowCount(TBL_USERS, "email", strtolower($data['email_address']))) {
        echo createResponse(400, "Registration Error", "Email already exists", "", "");
        $connection->close();
        exit();
    }
    if (queryOneRowCount(TBL_USERS, "username", strtolower($data['username']))) {
        echo createResponse(400, "Registration Error", "Username already exists", "", "");
        $connection->close();
        exit();
    }


    $insertData = array(
        "email_address" => strtolower($data['email_address']),
        "username" => strtolower($data['username']),
        "password" => password_hash($data['password'], PASSWORD_DEFAULT),
        "first_name" => ucwords($data['first_name']),
        "last_name" => ucwords($data['last_name'])
    );

    if (isset($data['image'])) {

        $imageFile = $data['image'];
        $imageFileName = $imageFile["name"];
        $fileExtension = pathinfo($imageFileName, PATHINFO_EXTENSION);

        $targetDirectory = "uploads/";

        if (!is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0700, true);
        }


        do {
            $insertData['uid'] = generateUID(6) . "-" . generateUID(6);
            $checkUIDSQL = "SELECT 1 FROM " . TBL_USERS . " WHERE uid = ?";
            $stmt = $connection->prepare($checkUIDSQL);
            $stmt->bind_param("s", $insertData['uid']);
            $stmt->execute();
            $result = $stmt->get_result();
        } while ($result->num_rows > 0);



        $targetFilePath = $targetDirectory . $insertData['uid'] . "." . $fileExtension;


        if (move_uploaded_file($imageFile["tmp_name"], $targetFilePath)) {
            $insertData['image'] = $imageFileName;

            $addNewUserSQL = "INSERT INTO " . TBL_USERS . " (
                uid,
                first_name,
                last_name,
                username,
                password,
                email,
                image_path,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);";

            $stmt = $connection->prepare($addNewUserSQL);
            $stmt->bind_param(
                "sssssss",
                $insertData['uid'],
                $insertData['first_name'],
                $insertData['last_name'],
                $insertData['username'],
                $insertData['password'],
                $insertData['email_address'],
                $targetFilePath
            );

            if ($stmt->execute()) {
                echo createResponse(201, "Registration Complete", "Log In from the Homepage", "", "");

                $newUID = "";

                do {
                    $newUID = generateUID(6) . "-" . generateUID(6);
                    $checkUIDSQL = "SELECT * FROM " . TBL_TRANSMUTATIONS . " WHERE uid = ?";
                    $stmt = $connection->prepare($checkUIDSQL);
                    $stmt->bind_param("s", $newUID);
                    $stmt->execute();
                    $result = $stmt->get_result();
                } while ($result->num_rows > 0);

                $defaultName = "Default";
                $defaultLowest = 60;
                $defaultPassing = 75;
                $defaultHighest = 100;

                $query = "INSERT INTO " . TBL_TRANSMUTATIONS . " (
                    teacher_uid,
                    uid,
                    name,
                    lowest,
                    passing,
                    highest,
                    is_default,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW());";

                $stmt = $connection->prepare($query);
                $stmt->bind_param(
                    "ssssss",
                    $insertData['uid'],
                    $newUID,
                    $defaultName,
                    $defaultLowest,
                    $defaultPassing,
                    $defaultHighest
                );

                $stmt->execute();


                $stmt->close();
                $connection->close();
                exit();
            } else {
                echo createResponse(400, "Registration Error", "Internal Server Error", $stmt->error, "");
                $stmt->close();
                $connection->close();
                exit();
            }
        } else {
            echo createResponse(400, "Registration Error", "Internal Server Error", "Image Relocation Failed", "");
            $stmt->close();
            $connection->close();
            exit();
        }

    } else {
        echo createResponse(400, "Registration Error", "Internal Server Error", "", "");
        $connection->close();
        exit();
    }


}