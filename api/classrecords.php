<?php

include_once "config.php";

session_start();

class ClassRecords extends Functions
{
    private $request;
    private $data;
    private $token;

    public function __construct($request = null)
    {
        if (!isset($_SESSION["uid"])) {
            http_response_code(403);
            echo createResponse(403, "Page Error", "Forbidden Access to Page", "Incorrect token", "");
            exit();
        }
        if (empty($request) || $request === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "Request is Empty", "Request is Empty", "");
            exit();
        }
        $this->request = $request;
    }

    public function Index()
    {
        global $connection;

        $this->TokenCheck($this->request);

        $query = "SELECT uid as id, transmutation_id, section_id, name as record_name FROM " . TBL_RECORDS . " WHERE teacher_uid = ? ORDER BY updated_at DESC";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $result = $result->fetch_all(MYSQLI_ASSOC);

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                "id" => $row["id"],
                "name" => $row["record_name"],
                "section" => $this->getSection($row["section_id"]),
                "transmutation" => $this->getTransmutation($row["transmutation_id"]),
                "components" => $this->getComponents($row["id"]),
            ];
        }

        http_response_code(200);
        echo createResponse(200, "GET Records Successful", "", "", $data);
        exit();
    }

    public function Store()
    {
        global $connection;
    }

    public function Sections()
    {
        global $connection;

        $this->TokenCheck($this->request);

        $query = "SELECT uid as id, section_name as name, sy_start as syStart, sy_end as syEnd, color FROM " . TBL_SECTIONS . " WHERE teacher_uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $result = $result->fetch_all(MYSQLI_ASSOC);

        http_response_code(200);
        echo createResponse(200, "GET Sections Successful", "", "", $result);
        exit();
    }

    private function getSection($id)
    {
        global $connection;

        $query = "SELECT uid as id, section_name as name, sy_start as syStart, sy_end as syEnd, color FROM " . TBL_SECTIONS . " WHERE teacher_uid = ? AND uid = ? LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $_SESSION["uid"], $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $row = $result->fetch_assoc();

        $data = [
            "id" => $row["id"],
            "name" => $row["name"],
            "syStart" => $row["syStart"],
            "syEnd" => $row["syEnd"],
            "color" => $row["color"],
        ];

        return $data;
    }

    private function SectionCheck($data)
    {
        if (empty($data) || $data === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Section Data is Empty", "");
            exit();
        }

        if (empty($data->id) || $data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Section ID is Empty", "");
            exit();
        }

        return true;
    }

    public function Transmutations()
    {
        global $connection;

        $this->TokenCheck($this->request);

        $query = "SELECT uid as id, name, lowest, passing, highest FROM " . TBL_TRANSMUTATIONS . " WHERE teacher_uid = ? ORDER BY is_default DESC, name DESC";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $result = $result->fetch_all(MYSQLI_ASSOC);

        http_response_code(200);
        echo createResponse(200, "GET Transmutations Successful", "", "", $result);
        exit();
    }

    private function getTransmutation($id)
    {
        global $connection;

        $query = "SELECT uid as id, name, lowest, passing, highest FROM " . TBL_TRANSMUTATIONS . " WHERE teacher_uid = ? AND uid = ? LIMIT 1";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $_SESSION["uid"], $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $row = $result->fetch_assoc();

        $data = [
            "id" => $row["id"],
            "name" => $row["name"],
            "lowest" => $row["lowest"],
            "passing" => $row["passing"],
            "highest" => $row["highest"],
        ];

        return $data;
    }

    private function TransmutationCheck($data)
    {

        if (empty($data) || $data === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Transmutation Data is Empty", "");
            exit();
        }

        if (empty($data->id) || $data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Transmutation ID is Empty", "");
            exit();
        }

        return true;
    }

    private function getComponents($id)
    {
        global $connection;

        $query = "SELECT uid as id, component_name as name, score, order_no FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ? ORDER BY order_no";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $result = $result->fetch_all(MYSQLI_ASSOC);

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                "id" => $row["id"],
                "name" => $row["name"],
                "score" => $row["score"],
                "order_no" => $row["order_no"],
                "activities" => $this->getCountActivities($row["id"]),
            ];
        }

        return $data;
    }

    private function getCountActivities($id)
    {
        global $connection;

        $query = "SELECT COUNT(uid) as count FROM " . TBL_ACTIVITIES . " WHERE component_id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $row = $result->fetch_assoc();

        return $row["count"];
    }

    private function RequestCheck($request)
    {
        if ($this->TokenCheck($request) && $this->DataCheck($request)) {
            $this->token = $request->token;
            $this->data = $request->data;
        } else {
            http_response_code(400);
            echo parent::createResponse(400, "Internal Server Error", "Internal Server Error", "", "");
            exit();
        }
    }

    private function DataCheck($request)
    {
        if (empty($request->data) || $request->data === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Data is Empty", "Data is Empty", "");
            exit();
        }

        $data = $request->data;



        $this->data = $data;

        return true;
    }

    private function TokenCheck($request)
    {
        if (empty($request->token) || $request->token === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Request Token is Empty", "");
            exit();
        }
        if (hash("sha256", $_SESSION["uid"]) !== $request->token) {
            http_response_code(403);
            echo parent::createResponse(403, "Page Error", "Forbidden Access to Page", "Incorrect token", "");
            session_destroy();
            exit();
        }

        $this->token = $request->token;

        return true;
    }
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




if (isset($_GET['sections'])) {
    $placeholder = new ClassRecords(json_decode($_GET['sections']));
    $placeholder->Sections();
}

if (isset($_GET['transmutations'])) {
    $placeholder = new ClassRecords(json_decode($_GET['transmutations']));
    $placeholder->Transmutations();
}

if (isset($_GET['index'])) {
    $placeholder = new ClassRecords(json_decode($_GET['index']));
    $placeholder->Index();
}

if (isset($_GET['store'])) {
    $placeholder = new ClassRecords(json_decode($_GET['store']));
    $placeholder->Store();
}