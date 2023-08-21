<?php

include_once "config.php";



if (isset($_GET['index'])) {
    $data = json_decode($_GET['index']);

    if (empty($data) || $data === null) {
        http_response_code(400);
        echo createResponse(400, "Error", "Request is Empty", "Request is Empty", "");
        exit();
    }

    if (empty($data->request) || $data->request === null) {
        http_response_code(400);
        echo createResponse(400, "Error", "Input is Empty", "Input is Empty", "");
        exit();
    }

    $data = $data->request;
    $data = preg_replace("/[^a-zA-Z0-9]/", "", $data);
    $data = str_replace('-', '', $data);
    $id = strtoupper(substr($data, 0, 6) . "-" . substr($data, 6));

    // Check if ID exists in Students Table.
    $query = "SELECT * FROM " . TBL_STUDENTS . " WHERE uid = ? LIMIT 1;";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result_student = $stmt->get_result();
    $result_student = $result_student->fetch_assoc();
    $stmt->close();

    if (empty($result_student)) {
        http_response_code(400);
        echo createResponse(400, "Error", "Student ID does not exist", "Student ID does not exist", "");
        exit();
    }

    $data = [
        "firstName" => $result_student['first_name'],
        "lastName" => $result_student['last_name'],
    ];

    // Get Section based on Student Section ID.
    $query = "SELECT * FROM " . TBL_SECTIONS . " WHERE uid = ? LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_student['section_id']);
    $stmt->execute();
    $result_section = $stmt->get_result();
    $result_section = $result_section->fetch_assoc();
    $stmt->close();

    if (empty($result_section)) {
        http_response_code(400);
        echo createResponse(400, "Error", "Internal Server Error", "Section does not exist", "");
        exit();
    }

    $data["section"] = [
        "name" => $result_section['section_name'],
        "syStart" => $result_section['sy_start'],
        "syEnd" => $result_section['sy_end'],
        "color" => $result_section['color'],
    ];


    // Get Records based on section_id
    $query = "SELECT * FROM " . TBL_RECORDS . " WHERE section_id = ? ORDER BY updated_at DESC";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_section['uid']);
    $stmt->execute();
    $result_records = $stmt->get_result();
    $result_records = $result_records->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $data["records"] = [];

    foreach ($result_records as $record) {
        $placeholder = [
            "name" => $record['name'],
            "transmutation" => [],
            "components" => [],
        ];

        // Get Transmutation based on Record Transmutation ID
        $query = "SELECT * FROM " . TBL_TRANSMUTATIONS . " WHERE uid = ? LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $record['transmutation_id']);
        $stmt->execute();
        $result_transmutation = $stmt->get_result();
        $result_transmutation = $result_transmutation->fetch_assoc();
        $stmt->close();

        if (empty($result_transmutation)) {
            http_response_code(400);
            echo createResponse(400, "Error", "Internal Server Error", "Transmutation does not exist", "");
            exit();
        }

        $placeholder["transmutation"] = [
            "lowest" => $result_transmutation['lowest'],
            "passing" => $result_transmutation['passing'],
            "highest" => $result_transmutation['highest'],
        ];

        // Get Record Components
        $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ? ORDER BY order_no";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $record['uid']);
        $stmt->execute();
        $result_components = $stmt->get_result();
        $result_components = $result_components->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        $placeholder["components"] = [];
        foreach ($result_components as $record_component) {
            $ph_record_component = [
                "name" => $record_component['component_name'],
                "score" => $record_component['score'],
                "activities" => [],
            ];

            // Get Activities
            $query = "SELECT * FROM " . TBL_ACTIVITIES . " WHERE component_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("s", $record_component['uid']);
            $stmt->execute();
            $result_activities = $stmt->get_result();
            $result_activities = $result_activities->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            foreach ($result_activities as $activity) {
                $ph_activity = [
                    "name" => $activity['activity_name'],
                    "type" => $activity['activity_type'],
                    "color" => $activity['color'],
                    "components" => [],
                ];

                // Get Activity Components
                $query = "SELECT * FROM " . TBL_ACTIVITIES_COMPONENTS . " WHERE activity_id = ?";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("s", $activity['uid']);
                $stmt->execute();
                $result_activity_components = $stmt->get_result();
                $result_activity_components = $result_activity_components->fetch_all(MYSQLI_ASSOC);
                $stmt->close();

                foreach ($result_activity_components as $activity_component) {
                    $ph_activity_component = [
                        "name" => $activity_component['component_name'],
                        "type" => $activity_component['component_type'],
                        "maxScore" => $activity_component['score'],
                        "bonus" => $activity_component['bonus'],
                    ];

                    // GET Student Activity
                    $query = "SELECT * FROM " . TBL_STUDENTS_ACTIVITIES . " WHERE student_id = ? AND activity_id = ? AND component_id = ?";
                    $stmt = $connection->prepare($query);
                    $stmt->bind_param("sss", $result_student['uid'], $activity['uid'], $activity_component['uid']);
                    $stmt->execute();
                    $result_student_activity = $stmt->get_result();
                    $result_student_activity = $result_student_activity->fetch_assoc();
                    $stmt->close();

                    if (empty($result_student_activity)) {
                        $ph_activity_component["score"] = 0;
                    } else {
                        $ph_activity_component["score"] = $result_student_activity['score'];
                    }

                    array_push($ph_activity["components"], $ph_activity_component);
                }

                // array_push($ph_activity["components"], $activity_components);
                array_push($ph_record_component["activities"], $ph_activity);
            }



            array_push($placeholder["components"], $ph_record_component);
        }

        // array_push($placeholder["components"], $components);

        array_push($data["records"], $placeholder);

    }

    // Get Teacher
    $query = "SELECT * FROM " . TBL_USERS . " WHERE uid IN
        (SELECT teacher_uid FROM " . TBL_SECTIONS . " WHERE uid = ?)";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $result_section['uid']);
    $stmt->execute();
    $result_teacher = $stmt->get_result();
    $result_teacher = $result_teacher->fetch_assoc();

    $data["instructor"] = [
        "firstName" => $result_teacher['first_name'],
        "lastName" => $result_teacher['last_name'],
        "imagePath" => $result_teacher['image_path'],
    ];



    http_response_code(200);
    echo createResponse(200, "GET Success", "Success", "Success", $data);
    exit();

}