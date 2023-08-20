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

        $this->RequestCheck($this->request);

        $this->RecordCheck($this->data);

        $data = $this->data;
        $section = $this->data->section;
        $transmutation = $this->data->transmutation;
        $components = $this->data->components;

        $newUID = "";

        do {
            $newUID = generateUID(6) . "-" . generateUID(6);
            $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = '" . $newUID . "' LIMIT 1";
            $stmt = $connection->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
        } while ($result->num_rows > 0);

        $query = "INSERT INTO " . TBL_RECORDS . " (
            teacher_uid,
            section_id,
            transmutation_id,
            uid,
            name,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(),NOW());";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("sssss", $_SESSION["uid"], $section->id, $transmutation->id, $newUID, $data->name);
        $stmt->execute();
        $stmt->close();

        foreach ($components as $component) {
            $newComponentUID = "";
            do {
                $newComponentUID = generateUID(6) . "-" . generateUID(6);
                $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = '" . $newComponentUID . "' LIMIT 1";
                $stmt = $connection->prepare($query);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();
            } while ($result->num_rows > 0);

            $query = "INSERT INTO " . TBL_RECORDS_COMPONENTS . " (
                record_id,
                uid,
                order_no,
                component_name,
                score,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, NOW(),NOW());";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ssssd", $newUID, $newComponentUID, $component->order_no, $component->name, $component->score);
            $stmt->execute();
            $stmt->close();
        }

        http_response_code(201);
        echo createResponse(201, "POST Record Successful", "", "", "");
        exit();

    }

    public function Update()
    {
        global $connection;

        $this->RequestCheck($this->request);

        $this->RecordCheck($this->data);

        $data = $this->data;

        $this->ComponentsCheck($data->components);

        // Update Record
        $query = "UPDATE " . TBL_RECORDS . " SET
            teacher_uid = ?,
            section_id = ?,
            transmutation_id = ?,
            name = ?,
            updated_at = NOW()
        WHERE uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("sssss", $_SESSION["uid"], $data->section->id, $data->transmutation->id, $data->name, $data->id);
        $stmt->execute();
        $stmt->close();

        // Update Record Components
        foreach ($data->components as $component) {

            // Check if Component ID exist
            $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ? AND record_id = ?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("ss", $component->id, $data->id);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            if ($result->num_rows === 0) {

                // Check Component by Name
                $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE record_id = ? AND component_name = ?";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("ss", $data->id, $component->name);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();

                if ($result->num_rows === 0) {

                    $newComponentUID = "";

                    do {
                        $newComponentUID = generateUID(6) . "-" . generateUID(6);
                        $query = "SELECT * FROM " . TBL_RECORDS_COMPONENTS . " WHERE uid = ? LIMIT 1";
                        $stmt = $connection->prepare($query);
                        $stmt->bind_param("s", $newComponentUID);
                        $stmt->execute();
                        $stmt->close();
                    } while ($result->num_rows > 0);

                    // Insert Component
                    $query = "INSERT INTO " . TBL_RECORDS_COMPONENTS . " (
                        record_id,
                        uid,
                        order_no,
                        component_name,
                        score,
                        created_at,
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, NOW(),NOW());";
                    $stmt = $connection->prepare($query);
                    $stmt->bind_param("sssss", $data->id, $newComponentUID, $component->order_no, $component->name, $component->score);
                    $stmt->execute();
                    $stmt->close();


                } else {

                    // Update Component based on Name
                    $query = "UPDATE " . TBL_RECORDS_COMPONENTS . " SET
                        order_no = ?,
                        score = ?,
                        component_name = ?,
                        updated_at = NOW()
                    WHERE component_name = ? AND record_id = ?";
                    $stmt = $connection->prepare($query);
                    $stmt->bind_param("sssss", $component->order_no, $component->score, $component->name, $component->name, $data->id);
                    $stmt->execute();
                    $stmt->close();

                }

            } else {

                // Update Component based on ID
                $query = "UPDATE " . TBL_RECORDS_COMPONENTS . " SET
                    order_no = ?,
                    score = ?,
                    component_name = ?,
                    updated_at = NOW()
                WHERE uid = ? AND record_id = ?";
                $stmt = $connection->prepare($query);
                $stmt->bind_param("sssss", $component->order_no, $component->score, $component->name, $component->id, $data->id);
                $stmt->execute();
                $stmt->close();
            }

        }


        http_response_code(200);
        echo createResponse(200, "Update Record Successful", "", "", "");
        exit();

    }

    public function Destroy()
    {
        global $connection;

        $this->RequestCheck($this->request);

        if (empty($this->data->id) || $this->data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Class Record ID is Empty", "");
            exit();
        }

        $record = $this->data;

        // Check Record ID if it exists
        $query = "SELECT * FROM " . TBL_RECORDS . " WHERE uid = ? AND teacher_uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $record->id, $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "Class Record does not exist", "Record ID does not exist", "");
            exit();
        }

        /*
            DELETE IN STUDENT ACTIVITIES TABLE
                THAT REFERENCES FROM ACTIVITIES TABLE
                    THAT REFERENCES RECORDS COMPONENTS TABLE
                        THAT REFERENCES RECORDS TABLE
        */


        // DELETE THE RECORD
        $query = "DELETE FROM " . TBL_RECORDS . " WHERE uid = ? AND teacher_uid = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $record->id, $_SESSION["uid"]);
        $stmt->execute();
        $stmt->close();

        http_response_code(200);
        echo createResponse(200, "DELETE Record Successful", "", "", "");
        exit();
    }

    private function RecordCheck($data)
    {

        if (empty($data->name) || $data->name === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "Class Record Name is Empty", "Class Record Name is Empty", "");
            exit();
        }

        $this->SectionCheck($data->section);
        $this->TransmutationCheck($data->transmutation);
        $this->ComponentsCheck($data->components);

        return true;

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
            echo parent::createResponse(400, "Request Error", "No Section Provided", "Section Data is Empty", "");
            exit();
        }

        if (empty($data->id) || $data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "No Section Provided", "Section ID is Empty", "");
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
        if (empty($data->name) || $data->name === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Name is Empty", "Transmutation Name is Empty", "");
            exit();
        }
        if (!is_numeric($data->lowest)) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Lowest is not a number", "Transmutation Lowest is Empty", "");
            exit();
        }
        if (!is_numeric($data->passing)) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Passing is not a number", "Transmutation Passing is Empty", "");
            exit();
        }
        if (!is_numeric($data->highest)) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Highest is not a number", "Transmutation Highest is Empty", "");
            exit();
        }
        if ($data->lowest >= $data->passing || $data->lowest >= $data->highest) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Lowest cannot be greater than or equal to the Passing or the Highest", "", "");
            exit();
        }
        if ($data->passing >= $data->highest) {
            http_response_code(400);
            echo parent::createResponse(400, "Error", "Transmutation Passing cannot be greater than or equal to the Highest", "", "");
            exit();
        }

        return true;
    }

    private function ComponentsCheck($data)
    {

        if (empty($data) || $data === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Request Error", "There are no components", "Component Data is Empty", "");
            exit();
        }

        $components = $data;

        foreach ($components as $component) {
            if (empty($component->id) || $component->id === null) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "A Request Data is Empty", "Component ID is Empty", "");
                exit();
            }
            if (empty($component->name) || $component->name === null) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "Component Name is Empty", "Component Name is Empty", "");
                exit();
            }
            if (!is_numeric($component->score)) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "Component Score is not a number", "Component Score is Invalid", "");
                exit();
            }
            if ($component->score <= 0) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "Component Score cannot be less than or equal to 0", "Component Score is Invalid", "");
                exit();
            }
            if (!is_numeric($component->order_no)) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "Component Order No is not a number", "Component Order No is Invalid", "");
                exit();
            }
            if ($component->order_no <= 0) {
                http_response_code(400);
                echo parent::createResponse(400, "Request Error", "Component Order No cannot be less than or equal to 0", "Component Order No is Invalid", "");
                exit();
            }

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
        return true;
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

if (isset($_POST['store'])) {
    $placeholder = new ClassRecords(json_decode($_POST['store']));
    $placeholder->Store();
}

if (isset($_POST['destroy'])) {
    $placeholder = new ClassRecords(json_decode($_POST['destroy']));
    $placeholder->Destroy();
}

if (isset($_POST['update'])) {
    $placeholder = new ClassRecords(json_decode($_POST['update']));
    $placeholder->Update();
}