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
        $data = array(
            "redirect" => true
        );
        echo createResponse(200, "Token Verified", "", "", $data);
        exit();
    }
    http_response_code(404);
    echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
    exit();

}

if (isset($_GET['populate'])) {
    /*
    Row Data JSON

    row {
      id: string
      syStart: string
      syEnd: string
      color: string
      gender: {
        male: number,
        female: number,
        other: number

      }
      students: [{
        id: string,
        gender: string,
        last_name: string,
        first_name: string
        birthday: string
        age: number
      },{}]
    }
    */
    $postData = json_decode($_GET['populate']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    } else {
        $query = "SELECT * FROM " . TBL_SECTIONS . " WHERE teacher_uid = '" . $_SESSION["uid"] . "' ORDER BY updated_at DESC";
        $result = $connection->query($query);

        $rows = [];

        while ($row = $result->fetch_assoc()) {
            $placeholder = array(
                "id" => $row["uid"],
                "name" => $row["section_name"],
                "syStart" => $row["sy_start"],
                "syEnd" => $row["sy_end"],
                "color" => $row["color"],
                "gender" => array(
                    "male" => 0,
                    "female" => 0,
                    "other" => 0
                ),
                "students" => []
            );


            $studentsQuery = "SELECT * FROM " . TBL_STUDENTS .
                " WHERE section_id = '" . $row["uid"] .
                "' ORDER BY CASE gender WHEN 'male' THEN 1 WHEN 'female' THEN 2 WHEN 'other' THEN 3 END, last_name";

            $studentsResult = $connection->query($studentsQuery);
            while ($student = $studentsResult->fetch_assoc()) {
                $studentsPlaceholder = array(
                    "id" => $student["uid"],
                    "gender" => ucwords($student["gender"]),
                    "last_name" => ucwords($student["last_name"]),
                    "first_name" => ucwords($student["first_name"]),
                    "birthday" => $student["birthday"],
                );

                if (strtolower($student["gender"]) == "male") {
                    $placeholder["gender"]["male"] += 1;
                }
                if (strtolower($student["gender"]) == "female") {
                    $placeholder["gender"]["female"] += 1;
                }
                if (strtolower($student["gender"]) == "other") {
                    $placeholder["gender"]["other"] += 1;
                }

                array_push($placeholder["students"], $studentsPlaceholder);
            }

            array_push($rows, $placeholder);
        }

        http_response_code(200);
        echo createResponse(200, "GET Successful", "Sections and Students collected", "", $rows);
        exit();
    }

}

if (isset($_POST['addSection'])) {
    $postData = json_decode($_POST['addSection']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }




    do {
        $newUID = generateUID(6) . "-" . generateUID(6);
        $query = "SELECT * FROM " . TBL_SECTIONS . " WHERE uid = '" . $newUID . "'";
        $result = $connection->query($query);
    } while ($result->num_rows > 0);

    $query = "INSERT INTO " . TBL_SECTIONS . " (
        teacher_uid,
        uid,
        section_name,
        sy_start,
        sy_end,
        color,
        created_at,
        updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
    $stmt = $connection->prepare($query);
    $stmt->bind_param(
        "ssssss",
        $_SESSION["uid"],
        $newUID,
        $postData->name,
        $postData->syStart,
        $postData->syEnd,
        $postData->color
    );
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo createResponse(200, "Add Successful", "Section created", "", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Add Failed", "Section not created", "", "");
        exit();
    }


}

if (isset($_POST['deleteSection'])) {
    $postData = json_decode($_POST['deleteSection']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    if (!$postData->id || queryOneRowCount(TBL_SECTIONS, "uid", $postData->id) == 0) {
        http_response_code(400);
        echo createResponse(400, "Update Failed", "Section not found", "", "");
        exit();
    }

    // DELETE STUDENTS THAT REFER TO THE SPECIFIC SECTION
    $query = "DELETE FROM " . TBL_STUDENTS . " WHERE section_id = '" . $postData->id . "'";
    $result = $connection->query($query);

    if (!$result) {
        http_response_code(400);
        echo createResponse(400, "Delete Failed", "Section not deleted", "", "");
        exit();
    }

    // DELETE THE SECTION FROM TBL_SECTIONS 
    $query = "DELETE FROM " . TBL_SECTIONS . " WHERE uid = '" . $postData->id . "' AND teacher_uid = '" . $_SESSION["uid"] . "'";
    $result = $connection->query($query);

    if ($result) {
        http_response_code(200);
        echo createResponse(200, "Delete Successful", "Section deleted", "", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Delete Failed", "Section not deleted", "", "");
        exit();
    }

}

if (isset($_POST['updateSection'])) {
    $postData = json_decode($_POST['updateSection']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    $query = "UPDATE " . TBL_SECTIONS . " SET
    section_name = '" . $postData->name . "',
    sy_start = '" . $postData->syStart . "',
    sy_end = '" . $postData->syEnd . "',
    color = '" . $postData->color . "',
    updated_at = NOW()
    WHERE uid = '" . $postData->id . "' AND teacher_uid = '" . $_SESSION["uid"] . "'";

    $result = $connection->query($query);

    if ($result) {
        http_response_code(200);
        echo createResponse(200, "Update Successful", "Section updated", "", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Update Failed", "Section not updated", "", "");
        exit();
    }


}

if (isset($_POST['addStudent'])) {
    $postData = json_decode($_POST['addStudent']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    if (!$postData->section_id) {
        http_response_code(400);
        echo createResponse(400, "Add Failed", "Section not found", "", "");
        exit();
    }

    do {
        $newUID = generateUID(6) . "-" . generateUID(6);
        $query = "SELECT * FROM " . TBL_STUDENTS . " WHERE uid = '" . $newUID . "' AND section_id = '" . $postData->section_id . "'";
        $result = $connection->query($query);
    } while ($result->num_rows > 0);

    if (
        strtolower($postData->gender) != "male" &&
        strtolower($postData->gender) != "female"
    ) {
        $postData->gender = "other";
    }

    $postData->last_name = ucwords($postData->last_name);
    $postData->first_name = ucwords($postData->first_name);
    $postData->gender = strtolower($postData->gender);

    $query = "INSERT INTO " . TBL_STUDENTS . " (
        section_id,
        uid,
        last_name,
        first_name,
        gender,
        birthday,
        created_at,
        updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";


    $stmt = $connection->prepare($query);
    $stmt->bind_param(
        "ssssss",
        $postData->section_id,
        $newUID,
        $postData->last_name,
        $postData->first_name,
        $postData->gender,
        $postData->birthday
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo createResponse(200, "Add Successful", "Student created", "", "");

        $query = "UPDATE " . TBL_SECTIONS . " SET updated_at = NOW() WHERE uid = '" . $postData->section_id . "'";
        $result = $connection->query($query);

        if (!$result) {
            http_response_code(400);
            echo createResponse(400, "Section Update Failed", "Failed to update section", "", "");
        }
        exit();
    }

    http_response_code(400);
    echo createResponse(400, "Add Failed", "Student not created", $stmt->error, "");
    exit();
}

if (isset($_POST['updateStudent'])) {
    $postData = json_decode($_POST['updateStudent']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    if (!$postData->section_id || queryOneRowCount(TBL_SECTIONS, "uid", $postData->section_id) == 0) {
        http_response_code(400);
        echo createResponse(400, "Update Failed", "Section not found", "", "");
        exit();
    }

    if (
        strtolower($postData->gender) != "male" &&
        strtolower($postData->gender) != "female"
    ) {
        $postData->gender = "other";
    }

    $postData->last_name = ucwords($postData->last_name);
    $postData->first_name = ucwords($postData->first_name);
    $postData->gender = strtolower($postData->gender);



    $query = "UPDATE " . TBL_STUDENTS . " SET
    last_name = '" . $postData->last_name . "',
    first_name = '" . $postData->first_name . "',
    gender = '" . $postData->gender . "',
    birthday = '" . $postData->birthday . "',
    updated_at = NOW()
    WHERE uid = '" . $postData->student_id . "' AND section_id = '" . $postData->section_id . "'";

    $result = $connection->query($query);

    if ($result) {
        http_response_code(200);
        echo createResponse(200, "Update Successful", "Student updated", "", "");

        $query = "UPDATE " . TBL_SECTIONS . " SET updated_at = NOW() WHERE uid = '" . $postData->section_id . "'";
        $result = $connection->query($query);

        if (!$result) {
            http_response_code(400);
            echo createResponse(400, "Section Update Failed", "Failed to update section", "", "");
        }
        exit();
    }

    http_response_code(400);
    echo createResponse(400, "Update Failed", "Student not updated", "", "");
    exit();
}

if (isset($_POST['deleteStudent'])) {
    $postData = json_decode($_POST['deleteStudent']);

    if (hash("sha256", $_SESSION["uid"]) !== $postData->token) {
        http_response_code(404);
        echo createResponse(404, "Redirect Error", "Incorrect token", "Incorrect token", "");
        session_destroy();
        exit();
    }

    if (!$postData->section_id || queryOneRowCount(TBL_SECTIONS, "uid", $postData->section_id) == 0) {
        http_response_code(400);
        echo createResponse(400, "Update Failed", "Section not found", "", "");
        exit();
    }

    $query = "DELETE FROM " . TBL_STUDENTS . " WHERE uid = '" . $postData->student_id . "' AND section_id = '" . $postData->section_id . "'";
    $result = $connection->query($query);

    if ($result) {
        http_response_code(200);
        echo createResponse(200, "Delete Successful", "Student deleted", "", "");

        $query = "UPDATE " . TBL_SECTIONS . " SET updated_at = NOW() WHERE uid = '" . $postData->section_id . "'";
        $result = $connection->query($query);

        if (!$result) {
            http_response_code(400);
            echo createResponse(400, "Section Update Failed", "Failed to update section", "", "");
        }

        exit();
    }

    http_response_code(400);
    echo createResponse(400, "Delete Failed", "Student not deleted", "", "");
    exit();
}

echo createResponse(404, "Internal Server Error", "End Of Line", "", "");
exit();