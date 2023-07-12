<?php

const SERVER_NAME = "localhost";
const USERNAME = "root";
const PASSWORD = "";
const DB_NAME = "wd66p_mp2";

$connection = new mysqli(SERVER_NAME, USERNAME, PASSWORD, DB_NAME);

if ($connection->connect_error) {
    returnResponse(400, "DB Connection Error", "Server DB Connection Error", $connection->connect_error, "");
}

session_start();





if (isset($_POST['login'])) {
    $postData = json_decode($_POST['login']);

    $tableName = "users";

    $DB_NAME = DB_NAME;

    if (!searchEmail(strtolower($postData->input)) && !searchUsername(strtolower($postData->input))) {
        returnResponse(400, "Login Error", "Account does not exist", "Account does not exist", "");
    }

    if (verifyPassword(strtolower($postData->input), $postData->password)) {
        $_SESSION["user"] = $postData->input;
        $data = array(
            "token" => hash("sha256", $postData->input),
            "redirect" => true
        );

        returnResponse(200, "Login Success", "", "", $data);
    } else {
        returnResponse(400, "Login Error", "Incorrect password", "Incorrect password", "");
    }



    exit();
}

if (isset($_POST['session']) && isset($_SESSION["user"])) {


    $postData = json_decode($_POST['session']);


    if (hash("sha256", $_SESSION["user"]) == $postData->token) {
        $data = array(
            "redirect" => true
        );
        returnResponse(200, "Token Verified", "", "", $data);
    } else {
        returnResponse(401, "Redirect Error", "Incorrect token", "Incorrect token", "");
    }

} else {
    returnResponse(401, "Redirect Error", "No token", "No token", "");
}

function verifyPassword($userInput, $password)
{
    global $connection;

    $stmt = $connection->prepare("SELECT password FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $userInput, $userInput);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return password_verify($password, $row['password']);
    } else {
        return false;
    }

}

function searchUsername($data)
{
    global $connection;
    $stmt = $connection->prepare("SELECT 1 FROM users WHERE username = ?");
    $stmt->bind_param("s", $data);
    $stmt->execute();
    $stmt->store_result();
    $result = $stmt->num_rows > 0;
    $stmt->close();
    return $result;

}

function searchEmail($data)
{
    global $connection;
    $checkEmail = "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)";
    $stmt = $connection->prepare($checkEmail);
    $stmt->bind_param("s", $data);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_row()[0];
}

function returnResponse($status, $title, $message, $description, $data)
{
    http_response_code($status);
    $returnJSON = compact('status', 'title', 'message', 'description', 'data');
    echo json_encode($returnJSON, JSON_PRETTY_PRINT);
    exit();
}