<?php

include_once "config.php";

session_start();

if (isset($_POST['login'])) {
    $postData = json_decode($_POST['login']);


    if (
        !queryOneRowCount(TBL_USERS, "email", strtolower($postData->credential)) &&
        !queryOneRowCount(TBL_USERS, "username", strtolower($postData->credential))
    ) {
        echo createResponse(400, "Login Error", "Account does not exist", "Account does not exist", "");
        $connection->close();
        exit();
    }

    if (verifyPassword(TBL_USERS, strtolower($postData->credential), $postData->password)) {
        $query = "SELECT * FROM users WHERE email = '" . strtolower($postData->credential) . "' OR username = '" . strtolower($postData->credential) . "'";
        $result = $connection->query($query);
        $user = $result->fetch_assoc();

        $_SESSION["uid"] = $user["uid"];

        if (!$_SESSION["uid"]) {
            echo createResponse(400, "Login Error", "Internal Server Error", "Incorrect password", "");
            session_destroy();
            $connection->close();
            exit();
        }

        $data = array(
            "token" => hash("sha256", $_SESSION["uid"]),
            "redirect" => true
        );

        echo createResponse(200, "Login Success", "", "", $data);
        exit();
    } else {
        echo createResponse(400, "Login Error", "Incorrect password", "Incorrect password", "");
        exit();
    }
}

include_once "session.php";