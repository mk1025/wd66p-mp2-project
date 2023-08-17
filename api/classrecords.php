<?php

include_once "config.php";

session_start();

if (isset($_POST['session']) && isset($_SESSION["uid"])) {
    /*
         ! DO NOT CLOSE THE DB CONNECTION HERE
         ! check $connection variable at config.php
     */
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
        echo createResponse(200, "Token Verified", "", "", $data);
        exit();
    }
    http_response_code(404);
    echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
    // session_destroy();
    exit();

}

if (isset($_GET['getSections'])) {
    $getData = json_decode($_GET['getSections']);

    if (hash("sha256", $_SESSION["uid"]) !== $getData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    $query = "SELECT uid as id, section_name as name, sy_start as syStart, sy_end as syEnd, color FROM " . TBL_SECTIONS . " WHERE teacher_uid = '" . $_SESSION["uid"] . "'";
    $result = $connection->query($query);

    $result = $result->fetch_all(MYSQLI_ASSOC);

    http_response_code(200);
    echo createResponse(200, "GET Sections Successful", "", "", $result);
    exit();

}

if (isset($_GET['populateRecords'])) {
    $getData = json_decode($_GET['populateRecords']);

    if (hash("sha256", $_SESSION["uid"]) !== $getData->token) {
        http_response_code(403);
        echo createResponse(403, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    /*
    Data Schema
    {
      "data": [{
        "id": string,
        "record_name": string,
        "section_id": string,
        "section_name": string,
        "syStart": string,
        "syEnd": string,
        "transmutation": {
          "id": string,
          "name": string,
          "lowest": number,
          "passing": number,
          "highest": number
        }
        "color": string,
        "components": [{
          "id": string,
          "component_name": string,
          "component_score": number,
          "activities": number,
        }]
      }]
    }
  */

    $data = [];

    $query = "SELECT uid as id, section_id, transmutation_id, name FROM " . TBL_RECORDS . " WHERE teacher_uid = ? ORDER BY updated_at DESC";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $_SESSION["uid"]);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $records = $result->fetch_all(MYSQLI_ASSOC);

        $stmt->close();

        foreach ($records as $record) {
            $placeholder = [
                "id" => $record["id"],
                "record_name" => $record["name"],
                "section_id" => $record["section_id"],
                "transmutation" => [],
                "components" => []
            ];

            $querySection = "SELECT section_name as name, color, sy_start, sy_end FROM " . TBL_SECTIONS . " WHERE uid = ? LIMIT 1";
            $stmt = $connection->prepare($querySection);
            $stmt->bind_param("s", $record["section_id"]);
            $stmt->execute();
            $stmt->bind_result($name, $color, $sy_start, $sy_end);

            $stmt->fetch();

            $resultSection = array(
                "name" => $name,
                "color" => $color,
                "sy_start" => $sy_start,
                "sy_end" => $sy_end
            );

            $stmt->close();

            $placeholder["section_name"] = $resultSection["name"];
            $placeholder["color"] = $resultSection["color"];
            $placeholder["syStart"] = $resultSection["sy_start"];
            $placeholder["syEnd"] = $resultSection["sy_end"];

            $queryTransmutation = "SELECT name, lowest, passing, highest FROM " . TBL_TRANSMUTATIONS . " WHERE uid = ? LIMIT 1";
            $stmt = $connection->prepare($queryTransmutation);
            $stmt->bind_param("s", $record["transmutation_id"]);
            $stmt->execute();
            $stmt->bind_result($name, $lowest, $passing, $highest);

            $stmt->fetch();

            $resultTransmutation = array(
                "name" => $name,
                "lowest" => $lowest,
                "passing" => $passing,
                "highest" => $highest
            );

            $stmt->close();


            $placeholder["transmutation"] = [
                "id" => $record["transmutation_id"],
                "name" => $resultTransmutation["name"],
                "lowest" => $resultTransmutation["lowest"],
                "passing" => $resultTransmutation["passing"],
                "highest" => $resultTransmutation["highest"]
            ];


            $queryComponents = "SELECT uid as id, component_name, score FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?";
            $stmt = $connection->prepare($queryComponents);
            $stmt->bind_param("s", $record["id"]);
            $stmt->execute();
            $stmt->bind_result($id, $name, $score);

            $results = array();

            while ($stmt->fetch()) {
                $row = array(
                    "id" => $id,
                    "component_name" => $name,
                    "component_score" => $score
                );

                array_push($results, $row);
            }

            $stmt->close();

            foreach ($results as $component) {
                $placeholderComponents = [
                    "id" => $component["id"],
                    "component_name" => $component["component_name"],
                    "component_score" => $component["component_score"],
                ];

                $queryActivities = "SELECT COUNT(*) as activities FROM " . TBL_ACTIVITIES . " WHERE component_id = ?";
                $stmt = $connection->prepare($queryActivities);
                $stmt->bind_param("s", $component["id"]);
                $stmt->execute();

                $stmt->bind_result($activities);
                $stmt->fetch();

                $placeholderComponents["activities"] = $activities;

                array_push($placeholder["components"], $placeholderComponents);

                $stmt->close();
            }

            array_push($data, $placeholder);
        }

    }

    http_response_code(200);
    echo createResponse(200, "GET Records Successful", "", "", $data);
    exit();
}



// RECORDS

if (isset($_POST['addRecord'])) {
    /*
        Data Schema
        {
            "addRecord": {
                name: string,
                section: string,
                components: array [
                    {
                        order: number,
                        name: string,
                        score: number
                    }
                ]
            }
        }
    */
    $postData = json_decode($_POST['addRecord']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Access to Page", "", "");
        session_destroy();
        exit();
    }

    if ($postData->name === "") {
        http_response_code(400);
        echo createResponse(400, "Create Record Error", "Class Record Name cannot be empty", "Name cannot be empty", "");
        exit();
    }
    if ($postData->section === "") {
        http_response_code(400);
        echo createResponse(400, "Create Record Error", "Class Record Section cannot be empty", "Section cannot be empty", "");
        exit();
    }
    if (!is_array($postData->components) || count($postData->components) === 0) {
        http_response_code(400);
        echo createResponse(400, "Create Record Error", "There must be atleast 1 component in the Class Record", "There must be atleast 1 component", "");
        exit();
    }
    foreach ($postData->components as $component) {
        if ($component->order === "") {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component order cannot be empty", "Component order cannot be empty", "");
            exit();
        }
        if (!is_numeric($component->order)) {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component order must be a number", "Component order must be a number", "");
            exit();
        }
        if ($component->order <= 0) {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component order must not be less than or equal to 0", "Component order cannot be negative", "");
            exit();
        }
        if ($component->name === "") {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component name cannot be empty", "Component name cannot be empty", "");
            exit();
        }
        if ($component->score === "") {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component score cannot be empty", "Component score cannot be empty", "");
            exit();
        }
        if (!is_numeric($component->score)) {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component score must be a number", "Component score must be a number", "");
            exit();
        }
        if ($component->score <= 0) {
            http_response_code(400);
            echo createResponse(400, "Create Record Error", "Component score must not be less than or equal to 0%", "Component score cannot be negative", "");
            exit();
        }
    }


    $newRecordUID = "";
    $default = "Default";




    do {
        $newRecordUID = generateUID(6) . "-" . generateUID(6);
        $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = '" . $newRecordUID . "' LIMIT 1";
        $result = $connection->query($query);
    } while ($result->num_rows > 0);

    $queryTransmutation = "SELECT uid FROM " . TBL_TRANSMUTATIONS . " WHERE name = ? LIMIT 1";
    $stmt = $connection->prepare($queryTransmutation);
    $stmt->bind_param("s", $default);
    $stmt->execute();
    $stmt->bind_result($defaultTransmutationID);

    $stmt->fetch();
    $stmt->close();


    $query = "INSERT INTO " . TBL_RECORDS . " (
        teacher_uid,
        section_id,
        transmutation_id,
        uid,
        name,
        created_at,
        updated_at
        )
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssss", $_SESSION["uid"], $postData->section, $defaultTransmutationID, $newRecordUID, $postData->name);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $stmt->close();

        http_response_code(200);
        echo createResponse(200, "Add Successful", "Record created", "", "");

        $components = $postData->components;

        foreach ($components as $component) {

            do {
                $newComponentUID = generateUID(6) . "-" . generateUID(6);
                $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = '" . $newComponentUID . "'";
                $result = $connection->query($query);
            } while ($result->num_rows > 0);

            $query = "INSERT INTO " . TBL_RECORDS_COMPONENTS . " (
                record_id,
                uid,
                order_no,
                component_name,
                score,
                created_at,
                updated_at
                )
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
            $stmt = $connection->prepare($query);
            $stmt->bind_param(
                "sssss",
                $newRecordUID,
                $newComponentUID,
                $component->order,
                $component->name,
                $component->score
            );
            $stmt->execute();

        }

        exit();

    }

    http_response_code(400);
    echo createResponse(400, "Add Error", "", "", "");
    exit();

}

if (isset($_POST['updateRecord'])) {
    /*
        Data Schema
        {
            "updateRecord": {
                token: string,
                id: string,
                name: string,
                section: string,
                components: array [
                    {
                        order: number
                        id: string
                        name: string
                        score: number
                    }
                ]
            }
        }
    */

    $postData = json_decode($_POST['updateRecord']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Access to Page", "Incorrect token", "");
        session_destroy();
        exit();
    }

    $queryRecords = "UPDATE " . TBL_RECORDS . " SET
    name = ?,
    section_id = ?,
    updated_at = NOW()
    WHERE uid = ?";
    $stmt = $connection->prepare($queryRecords);
    $stmt->bind_param("sss", $postData->name, $postData->section, $postData->id);
    $stmt->execute();
    $stmt->close();

    foreach ($postData->components as $component) {

        $queryComponents = "UPDATE " . TBL_RECORDS_COMPONENTS . " SET
            order_no = ?,
            component_name = ?,
            score = ?,
            updated_at = NOW()
            WHERE (uid = ?) OR (component_name = ? AND score = ? AND record_id = ?)";
        $stmt = $connection->prepare($queryComponents);
        $stmt->bind_param(
            "sssssss",
            $component->order,
            $component->name,
            $component->score,
            $component->id,
            $component->name,
            $component->score,
            $postData->id

        );
        $stmt->execute();

        $affectedRows = $stmt->affected_rows;

        $stmt->close();

        if ($affectedRows == 0) {
            if (strpos($component->id, "element-") !== false) {
                do {
                    $newComponentUID = generateUID(6) . "-" . generateUID(6);
                    $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = '" . $newComponentUID . "'";
                    $result = $connection->query($query);

                } while ($result->num_rows > 0);

                $queryNewComponent = "INSERT INTO " . TBL_RECORDS_COMPONENTS . " (
                record_id,
                uid,
                order_no,
                component_name,
                score,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
                $stmt = $connection->prepare($queryNewComponent);
                $stmt->bind_param(
                    "sssss",
                    $postData->id,
                    $newComponentUID,
                    $component->order,
                    $component->name,
                    $component->score

                );
                $stmt->execute();
                $stmt->close();

            }


        }

    }

    $queryGetComponents = "SELECT component_name FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?";
    $stmt = $connection->prepare($queryGetComponents);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();

    $result = $stmt->get_result();
    $allComponents = [];

    while ($row = $result->fetch_assoc()) {
        array_push($allComponents, $row["component_name"]);
    }

    $stmt->close();

    $postDataComponents = [];
    foreach ($postData->components as $component) {
        array_push($postDataComponents, $component->name);
    }

    $placeholder = array_diff($allComponents, $postDataComponents);

    foreach ($placeholder as $component) {
        $queryGetID = "SELECT uid FROM " . TBL_RECORDS_COMPONENTS . " WHERE component_name = ? AND record_id = ? LIMIT 1";
        $stmt = $connection->prepare($queryGetID);
        $stmt->bind_param("ss", $component, $postData->id);
        $stmt->execute();
        $stmt->bind_result($id);
        $stmt->fetch();
        $stmt->close();

        $query = "DELETE FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE activity_id IN
        (
            SELECT uid FROM " . TBL_ACTIVITIES . " WHERE component_id = ?
        )
        ";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();

        $query = "DELETE FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id IN 
        (
            SELECT uid FROM " . TBL_ACTIVITIES . " WHERE component_id = ?
        )
        ";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();

        $queryDeleteActivities = "DELETE FROM " . TBL_ACTIVITIES . " WHERE component_id = ?";
        $stmt = $connection->prepare($queryDeleteActivities);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();

        $queryDeleteComponent = "DELETE FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ?";
        $stmt = $connection->prepare($queryDeleteComponent);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();
    }




    http_response_code(200);
    echo createResponse(200, "Update Successful", "", "", "");
    exit();
}

if (isset($_POST['deleteRecord'])) {
    /*
        Data Schema
        {
            "deleteRecord": {
                token: string,
                id: string
            }
        }
    */
    $postData = json_decode($_POST['deleteRecord']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Access to Page", "Incorrect Token", "");
        session_destroy();
        exit();
    }

    if ($postData->id === "") {
        http_response_code(400);
        echo createResponse(400, "Delete Record Error", "Record ID cannot be empty", "Record ID cannot be empty", "");
        exit();
    }

    $queryCheck = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = ?";
    $stmt = $connection->prepare($queryCheck);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->fetch();


    if ($stmt->num_rows === 0) {
        $stmt->close();
        http_response_code(404);
        echo createResponse(404, "Delete Class Record Error", "Record not found", "Record not found", "");
        exit();
    }

    $query = "DELETE FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE component_id IN
        (SELECT uid FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id IN
            (SELECT uid FROM " . TBL_ACTIVITIES . " WHERE component_id IN 
                (SELECT uid FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?))
        );
    ";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->close();

    $query = "DELETE FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id IN
        (SELECT uid FROM " . TBL_ACTIVITIES . " WHERE component_id IN
            (SELECT uid FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?))
        ";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->close();

    $queryActivities = "DELETE FROM " . TBL_ACTIVITIES . " WHERE component_id IN
        (SELECT uid FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?)";
    $stmt = $connection->prepare($queryActivities);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->close();

    $queryComponents = "DELETE FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ?";
    $stmt = $connection->prepare($queryComponents);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->close();

    $queryRecord = "DELETE FROM " . TBL_RECORDS . " WHERE uid = ?";
    $stmt = $connection->prepare($queryRecord);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->close();

    http_response_code(200);
    echo createResponse(200, "Delete Successful", "", "", "");
    exit();
}


// COMPONENTS
if (isset($_POST['deleteComponent'])) {

    $postData = json_decode($_POST['deleteComponent']);



    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }
}

if (isset($_POST['logout'])) {
    session_destroy();
    http_response_code(200);
    echo createResponse(200, "Logout Successful", "", "", "");
    exit();
}