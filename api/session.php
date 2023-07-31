<?php

if (isset($_POST['session']) && isset($_SESSION["uid"])) {
    /*
        ! DO NOT CLOSE THE DB CONNECTION HERE
        ! check $connection variable at config.php
    */
    $postData = json_decode($_POST['session']);

    if (hash("sha256", $_SESSION["uid"]) == $postData->token) {
        $data = array(
            "redirect" => true
        );
        http_response_code(200);
        echo createResponse(200, "Token Verified", "", "", $data);
        exit();
    } else {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }
} else {
    http_response_code(404);
    echo createResponse(404, "Redirect Error", "No token", "No token", "");
    session_destroy();
    exit();
}