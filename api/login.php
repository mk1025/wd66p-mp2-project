<?php

include_once "config.php";

session_start();

if (isset($_POST['login'])) {
    $postData = json_decode($_POST['login']);


    if (
        !queryOneData(TBL_USERS, "email", strtolower($postData->credential)) &&
        !queryOneData(TBL_USERS, "username", strtolower($postData->credential))
    ) {
        returnResponse(400, "Login Error", "Account does not exist", "Account does not exist", "");
    }

    if (verifyPassword(TBL_USERS, strtolower($postData->credential), $postData->password)) {
        $_SESSION["user"] = $postData->credential;
        $data = array(
            "token" => hash("sha256", $postData->credential),
            "redirect" => true
        );

        echo createResponse(200, "Login Success", "", "", $data);
        exit();
    } else {
        echo createResponse(400, "Login Error", "Incorrect password", "Incorrect password", "");
        exit();
    }
}

if (isset($_POST['session']) && isset($_SESSION["user"])) {
    $postData = json_decode($_POST['session']);

    if (hash("sha256", $_SESSION["user"]) == $postData->token) {
        $data = array(
            "redirect" => true
        );
        echo createResponse(200, "Token Verified", "", "", $data);
        exit();
    } else {
        echo createResponse(401, "Redirect Error", "Incorrect token", "Incorrect token", "");
        exit();
    }
} else {
    echo createResponse(401, "Redirect Error", "No token", "No token", "");
    exit();
}