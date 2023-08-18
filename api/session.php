<?php

include_once "config.php";

session_start();

if (isset($_POST['session'])) {
    /*
         ! DO NOT CLOSE THE DB CONNECTION HERE
         ! check $connection variable at config.php
     */
    if (!isset($_SESSION["uid"])) {
        http_response_code(404);
        echo createResponse(404, "Token Unverified", "Token Not Found", "", "");
        session_destroy();
        exit();
    }

    $postData = json_decode($_POST['session']);

    if (hash("sha256", $_SESSION["uid"]) == $postData->token) {

        $query = "SELECT first_name as firstName, last_name as lastName, image_path as imagePath FROM " . TBL_USERS . "  WHERE uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();

        $result = $stmt->get_result();

        $result = $result->fetch_all(MYSQLI_ASSOC);

        $stmt->close();

        $data = array(
            "redirect" => true,
            "user" => array(
                "firstName" => ucwords($result[0]["firstName"]),
                "lastName" => ucwords($result[0]["lastName"]),
                "imagePath" => $result[0]["imagePath"]
            )
        );
        http_response_code(200);
        echo createResponse(200, "Token Verified", "", "", $data);
        exit();
    }
    http_response_code(403);
    echo createResponse(403, "Redirect Error", "Incorrect token", "Incorrect token", "");
    session_destroy();
    exit();

}

if (isset($_POST['logout'])) {
    http_response_code(200);
    echo createResponse(200, "Logout Successful", "", "", "");
    session_destroy();
    exit();
}