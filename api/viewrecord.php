<?php

include_once "config.php";

session_start();

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

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
    http_response_code(403);
    echo createResponse(403, "Redirect Error", "Incorrect token", "Incorrect token", "");
    session_destroy();
    exit();

}

if (isset($_GET['getData'])) {
    /*
        Data Schema (received)

        'getData' : {
            token: string
            id: string // Record ID
        }
    */
    $postData = json_decode($_GET['getData']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Request", "Incorrect token", "");
        session_destroy();
        exit();
    }
    if ($postData->id === "" || $postData->id === null || is_numeric($postData->id)) {
        http_response_code(400);
        echo createResponse(400, "Class Record Error", "Unknown Class Record", "", "");
        exit();
    }

    $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        http_response_code(404);
        echo createResponse(404, "Class Record Error", "Unknown Class Record", "", "");
        exit();
    }

    /*
        Data Schema (To Return to Client)

        data: {
            id: string,
            name: string,
            section_id: string,
            section_name: string,
            syStart: string,
            syEnd: string,
            color: string,
            transmutation: {
                id: string,
                name: string,
                lowest: number,
                passing: number,
                highest: number
            }
            components: [
                {
                    id: string,
                    name: string,
                    order_no: number,
                    score: number,
                    activities: [
                        {
                            id: string,
                            name: string,
                            type: string,
                            color: string,
                            components: [
                                {
                                    id: string,
                                    name: string,
                                    type: string,
                                    score: number,
                                    bonus: boolean
                                }
                            ]
                        }
                    ]
                }
            ],
            students: [
                {
                    id: string,
                    gender: string,
                    last_name: string,
                    first_name: string,
                    activities: [
                        {
                            id: string,
                            components: [
                                {
                                    id: string,
                                    score: number
                                }
                            ]
                        }
                    ]

                }
            ]
        }
    */

    $query = "SELECT section_id, transmutation_id, name FROM " . TBL_RECORDS . " WHERE teacher_uid = ? AND uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $_SESSION["uid"], $postData->id);
    $stmt->execute();
    $result_record = $stmt->get_result();
    $result_record = $result_record->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $sendData = [
        "id" => $postData->id,
        "name" => $result_record[0]["name"],
        "section_id" => $result_record[0]["section_id"],
        // "section_name"
        // "syStart"
        // "syEnd"
        // "color"
        "transmutation" => [
            "id" => $result_record[0]["transmutation_id"],
            // "lowest"
            // "passing"
            // "highest"
            // "name"
        ],
        // The rest of the data
    ];


    $query = "SELECT section_name, sy_start, sy_end, color FROM " . TBL_SECTIONS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_record[0]["section_id"]);
    $stmt->execute();
    $result_section = $stmt->get_result();
    $result_section = $result_section->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $sendData["section_name"] = $result_section[0]["section_name"];
    $sendData["syStart"] = $result_section[0]["sy_start"];
    $sendData["syEnd"] = $result_section[0]["sy_end"];
    $sendData["color"] = $result_section[0]["color"];

    $query = "SELECT name, lowest, passing, highest FROM " . TBL_TRANSMUTATIONS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_record[0]["transmutation_id"]);
    $stmt->execute();
    $result_transmutations = $stmt->get_result();
    $result_transmutations = $result_transmutations->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $sendData["transmutation"]["name"] = $result_transmutations[0]["name"];
    $sendData["transmutation"]["lowest"] = $result_transmutations[0]["lowest"];
    $sendData["transmutation"]["passing"] = $result_transmutations[0]["passing"];
    $sendData["transmutation"]["highest"] = $result_transmutations[0]["highest"];

    $query = "SELECT uid, order_no, component_name, score FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ? ORDER BY order_no";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->id);
    $stmt->execute();
    $result_components = $stmt->get_result();
    $result_components = $result_components->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $placeholder_components = [];

    foreach ($result_components as $component) {

        $query = "SELECT uid, activity_name, activity_type, color FROM " . TBL_ACTIVITIES . " WHERE component_id = ? ORDER BY created_at ASC";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $component["uid"]);
        $stmt->execute();
        $result_activities = $stmt->get_result();
        $result_activities = $result_activities->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        $placeholder_activities = [];
        foreach ($result_activities as $activity) {

            $query = "SELECT uid, activity_id, component_name, component_type, score, bonus FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id = ? ORDER BY created_at ASC";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("s", $activity["uid"]);
            $stmt->execute();
            $result_activities_components = $stmt->get_result();
            $result_activities_components = $result_activities_components->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            $placeholder_activities_components = [];
            foreach ($result_activities_components as $activities_component) {

                $placeholder_activities_components[] = [
                    "id" => $activities_component["uid"],
                    "name" => $activities_component["component_name"],
                    "type" => $activities_component["component_type"],
                    "score" => $activities_component["score"],
                    "bonus" => $activities_component["bonus"],
                ];
            }

            $placeholder_activities[] = [
                "id" => $activity["uid"],
                "name" => $activity["activity_name"],
                "type" => $activity["activity_type"],
                "color" => $activity["color"],
                "components" => $placeholder_activities_components
            ];
        }


        $placeholder_components[] = [
            "id" => $component["uid"],
            "name" => $component["component_name"],
            "order_no" => $component["order_no"],
            "score" => $component["score"],
            "activities" => $placeholder_activities,
        ];
    }

    $sendData["components"] = $placeholder_components;

    $query = "SELECT uid, last_name, first_name, gender FROM " . TBL_STUDENTS . " WHERE section_id = ? ORDER BY CASE gender WHEN 'male' THEN 1 WHEN 'female' THEN 2 WHEN 'other' THEN 3 END, last_name ";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_record[0]["section_id"]);
    $stmt->execute();
    $result_students = $stmt->get_result();
    $result_students = $result_students->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $placeholder_students = [];

    foreach ($result_students as $student) {

        $query = "SELECT activity_id, component_id, score FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE student_id = ? ORDER BY created_at ASC";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $student["uid"]);
        $stmt->execute();
        $result_students_activities = $stmt->get_result();
        $result_students_activities = $result_students_activities->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        $placeholder_students_activities = [];

        foreach ($result_students_activities as $student_activities) {
            $activity_id = $student_activities["activity_id"];
            $component_id = $student_activities["component_id"];
            $score = $student_activities["score"];

            if (!isset($placeholder_students_activities[$activity_id])) {
                $placeholder_students_activities[$activity_id] = [
                    "id" => $activity_id,
                    "components" => []
                ];
            }

            $component = [
                "id" => $component_id,
                "score" => $score
            ];

            $placeholder_students_activities[$activity_id]["components"][] = $component;
        }

        $psa = [];

        foreach ($placeholder_students_activities as $key => $value) {
            $psa[] = [
                "id" => $key,
                "components" => $value["components"]
            ];
        }

        $placeholder_students[] = [
            "id" => $student["uid"],
            "gender" => $student["gender"],
            "last_name" => $student["last_name"],
            "first_name" => $student["first_name"],
            "activities" => $psa
        ];
    }

    $sendData["students"] = $placeholder_students;


    http_response_code(200);
    echo createResponse(200, "GET Successful", "", "", $sendData);
    exit();

}

if (isset($_POST['addActivity'])) {
    /*
        Data Schema (addActivity): {
            token: string,
            data: {
                name: string,
                type: string,
                color: string,
                record_id: string,
                component_id: string,
                components: [
                    {
                        id: string,
                        name: string,
                        type: string,
                        score: number,
                        bonus: boolean
                    }
                ]
            }
        }
    */
    $postData = json_decode($_POST['addActivity']);

    if (empty($postData) || $postData === null) {
        http_response_code(400);
        echo createResponse(400, "Internal Server Error", "No Data Provided", "", "");
        exit();
    }
    if (empty($postData->token) || $postData->token === null) {
        http_response_code(403);
        echo createResponse(403, "Internal Server Error", "No Token Provided", "", "");
        exit();
    }
    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Request", "Incorrect token", "");
        session_destroy();
        exit();
    }
    if (empty($postData->data) || $postData->data === null) {
        http_response_code(400);
        echo createResponse(400, "Internal Server Error", "No Data Provided", "", "");
        exit();
    }

    $postData = $postData->data;

    if (empty($postData->name) || $postData->name === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Name Provided", "", "");
        exit();
    }
    if (empty($postData->type) || $postData->type === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Type Provided", "", "");
        exit();
    }
    if (empty($postData->color) || $postData->color === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Color Provided", "", "");
        exit();
    }
    if (empty($postData->record_id) || $postData->record_id === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Record ID Provided", "", "");
        exit();
    }
    if (empty($postData->component_id) || $postData->component_id === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Component ID Provided", "", "");
        exit();
    }
    if (empty($postData->components) || $postData->components === null) {
        http_response_code(400);
        echo createResponse(400, "Create Activity Error", "No Activity Components Provided", "", "");
        exit();
    }

    foreach ($postData->components as $component) {
        if (empty($component->id) || $component->id === null) {
            http_response_code(400);
            echo createResponse(400, "Create Activity Component Error", "No Activity Component ID Provided", "", "");
            exit();
        }
        if (empty($component->name) || $component->name === null) {
            http_response_code(400);
            echo createResponse(400, "Create Activity Component Error", "No Activity Component Name Provided", "", "");
            exit();
        }
        if (empty($component->type) || $component->type === null) {
            http_response_code(400);
            echo createResponse(400, "Create Activity Component Error", "No Activity Component Type Provided", "", "");
            exit();
        }
        if (empty($component->score) || $component->score === null || $component->score === 0) {
            http_response_code(400);
            echo createResponse(400, "Create Activity Component Error", "Activity Score must not be zero or empty", "", "");
            exit();
        }
        if (!is_bool($component->bonus) || $component->bonus === null) {
            http_response_code(400);
            echo createResponse(400, "Create Activity Component Error", "Activity Component Bonus must be a boolean", "", "");
            exit();
        }
    }

    $newActivityUID = "";

    do {
        $newActivityUID = generateUID(6) . "-" . generateUID(6);
        $query = "SELECT uid FROM " . TBL_ACTIVITIES . " WHERE uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $newActivityUID);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    } while ($result->num_rows > 0);

    $query = "INSERT INTO " . TBL_ACTIVITIES .
        " (
        component_id,
        uid,
        activity_name,
        activity_type,
        color,
        created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssss", $postData->component_id, $newActivityUID, $postData->name, $postData->type, $postData->color);
    $stmt->execute();
    $stmt->close();

    foreach ($postData->components as $component) {

        $newActivityComponentUID = "";
        do {
            $newActivityComponentUID = generateUID(6) . "-" . generateUID(6);
            $query = "SELECT uid FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE uid = ? AND activity_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ss", $newActivityComponentUID, $newActivityUID);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
        } while ($result->num_rows > 0);

        $query = "INSERT INTO " . TBL_ACTIVITIES_COMPONENTS .
            " (
            activity_id,
            uid,
            component_name,
            component_type,
            score,
            bonus,
            created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ssssii", $newActivityUID, $newActivityComponentUID, $component->name, $component->type, $component->score, $component->bonus);
        $stmt->execute();
        $stmt->close();

        $query = "SELECT * FROM " . TBL_STUDENTS . " WHERE section_id IN 
        (SELECT uid FROM " . TBL_SECTIONS . " WHERE teacher_uid = ?)";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();
        $result_students = $stmt->get_result();
        $result_students = $result_students->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        foreach ($result_students as $student) {
            $query = "INSERT INTO " . TBL_STUDENTS_ACTIVITIES . " (
                student_id,
                activity_id,
                component_id,
                score,
                created_at, updated_at
            ) VALUES (?, ?, ?, 0, NOW(), NOW())";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("sss", $student["uid"], $newActivityUID, $newActivityComponentUID);
            $stmt->execute();
            $stmt->close();
        }
    }

    // test
    http_response_code(200);
    echo createResponse(200, "Add Activity Succesful", "", "", "");
    exit();
}

if (isset($_POST['updateActivity'])) {
    /*
        Data Schema (updateActivity) : {
            token: string,
            data: {
                activity_id: string,
                record_id: string,
                component_id: string,
                name: string,
                type: string,
                color: string
                components: [
                    {
                        id: string,
                        name: string,
                        type: string,
                        score: number,
                        bonus: boolean
                    }
                ]
            }
        }
    */
    $postData = json_decode($_POST['updateActivity']);

    if (empty($postData) || $postData === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Data Provided", "", "");
        exit();
    }
    if (empty($postData->token) || $postData->token === null) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "No Token Provided", "", "");
        exit();
    }
    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Request", "Incorrect token", "");
        session_destroy();
        exit();
    }
    if (empty($postData->data) || $postData->data === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Data Provided", "", "");
        exit();
    }

    $postData = $postData->data;

    if (empty($postData->activity_id) || $postData->activity_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Activity ID Provided", "", "");
        exit();
    }
    if (empty($postData->record_id) || $postData->record_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Record ID Provided", "", "");
        exit();
    }
    if (empty($postData->component_id) || $postData->component_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Component ID Provided", "", "");
        exit();
    }
    if (empty($postData->name) || $postData->name === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Name Provided", "", "");
        exit();
    }
    if (empty($postData->type) || $postData->type === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Type Provided", "", "");
        exit();
    }
    if (empty($postData->color) || $postData->color === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Color Provided", "", "");
        exit();
    }
    if (empty($postData->components) || $postData->components === null) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Activity Components Provided", "", "");
        exit();
    }

    foreach ($postData->components as $component) {
        if (empty($component->id) || $component->id === null) {
            http_response_code(400);
            echo createResponse(400, "Update Activity Component Error", "No Activity Component ID Provided", "", "");
            exit();
        }
        if (empty($component->name) || $component->name === null) {
            http_response_code(400);
            echo createResponse(400, "Update Activity Component Error", "No Activity Component Name Provided", "", "");
            exit();
        }
        if (empty($component->type) || $component->type === null) {
            http_response_code(400);
            echo createResponse(400, "Update Activity Component Error", "No Activity Component Type Provided", "", "");
            exit();
        }
        if (empty($component->score) || $component->score === null || $component->score === 0) {
            http_response_code(400);
            echo createResponse(400, "Update Activity Component Error", "Activity Score must not be zero or empty", "", "");
            exit();
        }
    }

    // Check if Class Record exist based on Record ID
    $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->record_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Record Found", "", "");
        exit();
    }

    // Check if Class Record Component based on Component ID and Class Record ID
    $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ? AND record_id = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->component_id, $postData->record_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Record Component Found", "", "");
        exit();
    }

    // Check if Activity exists based on Activity ID and Component ID
    $query = "SELECT * FROM " . TBL_ACTIVITIES . " WHERE uid = ? AND component_id = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->activity_id, $postData->component_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo createResponse(400, "Update Activity Error", "No Activity Found", "", "");
        exit();
    }

    // Perform Update on Activity
    $query = "UPDATE " . TBL_ACTIVITIES . " SET 
        activity_name = ?,
        activity_type = ?,
        color = ?,
        updated_at = NOW()
    WHERE uid = ? AND component_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("sssss", $postData->name, $postData->type, $postData->color, $postData->activity_id, $postData->component_id);
    $stmt->execute();
    $stmt->close();


    $NewComponents = [];
    // Perform Update on Activity Components
    foreach ($postData->components as $component) {
        // Check if Activity Component exists based on its ID and Activity ID
        $query = "SELECT * FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE uid = ? AND activity_id = ? LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $component->id, $postData->activity_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {

            // Check Activity component by its name and activity ID and update it
            $query = "SELECT * FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id = ? AND component_name = ? LIMIT 1";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ss", $postData->activity_id, $component->name);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            if ($result->num_rows === 0) {
                // Generate a new Activity Component instead.

                $newActivityComponentUID = "";
                do {
                    $newActivityComponentUID = generateUID(6) . "-" . generateUID(6);
                    $query = "SELECT uid FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE uid = ?";
                    $stmt = $connection->prepare($query);
                    $stmt->bind_param("s", $newActivityComponentUID);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $stmt->close();
                } while ($result->num_rows > 0);

                $query = "INSERT INTO " . TBL_ACTIVITIES_COMPONENTS . " (
                    activity_id,
                    uid,
                    component_name,
                    component_type,
                    score,
                    bonus,
                    created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("ssssii", $postData->activity_id, $newActivityComponentUID, $component->name, $component->type, $component->score, $component->bonus);
                $stmt->execute();

                $query = "SELECT * FROM " . TBL_STUDENTS . " WHERE section_id IN
                    (SELECT uid FROM " . TBL_SECTIONS . " WHERE teacher_uid = ?)";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("s", $_SESSION["uid"]);
                $stmt->execute();
                $result_students = $stmt->get_result();
                $stmt->close();

                foreach ($result_students->fetch_all(MYSQLI_ASSOC) as $student) {
                    $query = "INSERT INTO " . TBL_STUDENTS_ACTIVITIES . " (
                        student_id,
                        activity_id,
                        component_id,
                        score,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, 0, NOW(), NOW())";
                    $stmt = $connection->prepare($query);
                    $stmt->bind_param("sss", $student["uid"], $postData->activity_id, $newActivityComponentUID);
                    $stmt->execute();
                    $stmt->close();
                }

                array_push($NewComponents, $newActivityComponentUID);
            } else {
                // Update the Activity Component by its name and activity ID
                $query = "UPDATE " . TBL_ACTIVITIES_COMPONENTS . " SET
                    component_name = ?,
                    component_type = ?,
                    score = ?,
                    bonus = ?,
                    updated_at = NOW()
                    WHERE component_name = ? AND activity_id = ?";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("ssiiss", $component->name, $component->type, $component->score, $component->bonus, $component->name, $postData->activity_id);
                $stmt->execute();
                $stmt->close();

                // Get the ID of the updated Activity Component
                $query = "SELECT uid FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE component_name = ? AND activity_id = ? LIMIT 1";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("ss", $component->name, $postData->activity_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();

                array_push($NewComponents, $result->fetch_assoc()["uid"]);
            }
        } else {
            $query = "UPDATE " . TBL_ACTIVITIES_COMPONENTS . " SET 
                component_name = ?,
                component_type = ?,
                score = ?,
                bonus = ?,
                updated_at = NOW()
            WHERE uid = ? AND activity_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ssiiss", $component->name, $component->type, $component->score, $component->bonus, $component->id, $postData->activity_id);
            $stmt->execute();
            $stmt->close();

            array_push($NewComponents, $component->id);

        }
    }

    $AllComponents = [];

    // Get The Activity Components based on the Activity ID
    $query = "SELECT * FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->activity_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        array_push($AllComponents, $row);
    }

    $stmt->close();

    // Delete Components that are not from New Components
    foreach ($AllComponents as $component) {
        if (!in_array($component["uid"], $NewComponents)) {
            // Delete the Activity Component from Students Activities based on the component's ID
            $query = "DELETE FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE component_id = ? AND activity_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ss", $component["uid"], $postData->activity_id);
            $stmt->execute();
            $stmt->close();

            // Then delete the Activity Component
            $query = "DELETE FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE uid = ? AND activity_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ss", $component["uid"], $postData->activity_id);
            $stmt->execute();
            $stmt->close();
        }
    }



    http_response_code(200);
    echo createResponse(200, "Update Activity Successful", "", "", "");
    exit();
}

if (isset($_POST['updateStudentActivity'])) {
    /*
        Data Schema (updateStudentActivity) : {
            token: string,
            data: {
                record_id: string,
                component_id: string,
                student_id: string,
                activity_id: string,
                activities: [{
                    component_id: string,
                    student_score: number
                }]
            }
        }
    */
    $postData = json_decode($_POST['updateStudentActivity']);

    if (empty($postData) || $postData === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Data Provided", "", "");
        exit();
    }
    if (empty($postData->token) || $postData->token === null) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "No Token Provided", "", "");
        exit();
    }
    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Request", "Incorrect token", "");
        session_destroy();
        exit();
    }
    if (empty($postData->data) || $postData->data === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Data Provided", "", "");
        exit();
    }

    $postData = $postData->data;

    if (empty($postData->record_id) || $postData->record_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Record ID Provided", "", "");
        exit();
    }
    if (empty($postData->component_id) || $postData->component_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Component ID Provided", "", "");
        exit();
    }
    if (empty($postData->student_id) || $postData->student_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Student ID Provided", "", "");
        exit();
    }
    if (empty($postData->activity_id) || $postData->activity_id === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Activity ID Provided", "", "");
        exit();
    }
    if (empty($postData->activities) || $postData->activities === null) {
        http_response_code(400);
        echo createResponse(400, "Update Student Activity Error", "No Activities Provided", "", "");
        exit();
    }

    foreach ($postData->activities as $activity) {
        if (empty($activity->component_id) || $activity->component_id === null) {
            http_response_code(400);
            echo createResponse(400, "Update Student Activity Error", "No Component ID Provided", "", "");
            exit();
        }
        if (!isset($activity->student_score) || $activity->student_score === "") {
            http_response_code(400);
            echo createResponse(400, "Update Student Activity Error", "No Student Score Provided", "", "");
            exit();
        }
    }

    // Check if Class Record exist based on Record ID
    $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->record_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo createResponse(404, "Update Student Activity Error", "Record Not Found", "", "");
        exit();
    }

    // Check if Class Record Component based on Component ID and Class Record ID
    $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ? AND record_id = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->component_id, $postData->record_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo createResponse(404, "Update Student Activity Error", "Component Not Found", "", "");
        exit();
    }

    // Check if Activity exist based on Class Record Component ID and Activity ID
    $query = "SELECT * FROM " . TBL_ACTIVITIES . " WHERE uid = ? AND component_id = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->activity_id, $postData->component_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo createResponse(404, "Update Student Activity Error", "Activity Not Found", "", "");
        exit();
    }

    // Check if Activity Component ID exist based on Activity ID and the Activity Component ID
    foreach ($postData->activities as $activity) {
        $query = "SELECT * FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE uid = ? AND activity_id = ? LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $activity->component_id, $postData->activity_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo createResponse(404, "Update Student Activity Error", "Activity Component Not Found", "", "");
            exit();
        }
    }

    // Update
    foreach ($postData->activities as $activity) {
        // $query = "UPDATE " . TBL_STUDENTS_ACTIVITIES . " SET score = ?, updated_at = NOW() WHERE component_id = ? AND activity_id = ? AND student_id = ?";
        // $stmt = $connection->prepare($query);
        // $stmt->bind_param("ssss", $activity->student_score, $activity->component_id, $postData->activity_id, $postData->student_id);
        // $stmt->execute();
        // $stmt->close();

        // 

        // Update and get affected rows
        $query = "UPDATE " . TBL_STUDENTS_ACTIVITIES . " SET score = ?, updated_at = NOW() WHERE component_id = ? AND activity_id = ? AND student_id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ssss", $activity->student_score, $activity->component_id, $postData->activity_id, $postData->student_id);
        $stmt->execute();
        $affectedRows = $stmt->affected_rows;
        $stmt->close();


        if ($affectedRows === 0) {
            // Insert Instead

            $query = "INSERT INTO " . TBL_STUDENTS_ACTIVITIES . " (component_id, activity_id, student_id, score, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ssss", $activity->component_id, $postData->activity_id, $postData->student_id, $activity->student_score);
            $stmt->execute();
            $stmt->close();

        }


    }

    http_response_code(200);
    echo createResponse(200, "Update Student Activity Successful", "", "", "");
    exit();


}

if (isset($_POST['deleteActivity'])) {
    /*
        Data Schema (deleteActivity) : {
            token: string,
            data: {
                component_id:string,
                activity_id:string
            }
        }
    */

    $postData = json_decode($_POST['deleteActivity']);

    if (empty($postData) || $postData === null) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "No Data Provided", "", "");
        exit();
    }
    if (empty($postData->token) || $postData->token === null) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "No Token Provided", "", "");
        exit();
    }
    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(403);
        echo createResponse(403, "Page Error", "Forbidden Request", "Incorrect token", "");
        session_destroy();
        exit();
    }
    if (empty($postData->data) || $postData->data === null) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "No Data Provided", "", "");
        exit();
    }

    $postData = $postData->data;

    if (empty($postData->component_id) || $postData->component_id === null) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "No Component ID Provided", "", "");
        exit();
    }
    if (empty($postData->activity_id) || $postData->activity_id === null) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "No Activity ID Provided", "", "");
        exit();
    }

    // Check if class record component id exists
    $query = "SELECT uid FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->component_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "Component ID does not exist", "", "");
        exit();
    }

    // Check if activity id exists
    $query = "SELECT uid FROM " . TBL_ACTIVITIES . " WHERE uid = ? AND component_id = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->activity_id, $postData->component_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo createResponse(400, "Delete Activity Error", "Activity ID does not exist", "", "");
        exit();
    }


    // Delete Student Activities based on Activity ID and Component ID
    $query = "DELETE FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE activity_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->activity_id);
    $stmt->execute();
    $stmt->close();

    // Delete Activity Components based on Activity ID
    $query = "DELETE FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $postData->activity_id);
    $stmt->execute();
    $stmt->close();

    // Delete Activity based on Component ID
    $query = "DELETE FROM " . TBL_ACTIVITIES . " WHERE uid = ? AND component_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $postData->activity_id, $postData->component_id);
    $stmt->execute();
    $stmt->close();


    http_response_code(200);
    echo createResponse(200, "Delete Activity Successful", "", "", "");
    exit();

}

function checkEmpty($data = array())
{

    foreach ($data as $value) {
        if (empty($value) || $value === null) {
            return true;
        }
    }
    return false;
}