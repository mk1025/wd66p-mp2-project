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