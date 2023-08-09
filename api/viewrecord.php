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

        $placeholder_students[] = [
            "id" => $student["uid"],
            "gender" => $student["gender"],
            "last_name" => $student["last_name"],
            "first_name" => $student["first_name"],
            "activities" => $placeholder_students_activities
        ];
    }

    $sendData["students"] = $placeholder_students;


    http_response_code(200);
    echo createResponse(200, "GET Successful", "", "", $sendData);
    exit();

}