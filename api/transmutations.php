<?php

include_once "config.php";

session_start();




class Transmutation extends Functions
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

        $query = "SELECT uid as id, name, lowest, passing, highest, is_default
        FROM " . TBL_TRANSMUTATIONS . " WHERE teacher_uid = ? ORDER BY is_default DESC, updated_at DESC";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
        }

        http_response_code(200);
        echo parent::createResponse(200, "GET Request Successful", "Request Successful", "", $data);
        exit();

    }

    public function Store()
    {
        global $connection;

        $this->RequestCheck($this->request);

        $newUID = "";

        do {
            $newUID = generateUID(6) . "-" . generateUID(6);
            $query = "SELECT * FROM " . TBL_TRANSMUTATIONS . " WHERE uid = '" . $newUID . "' LIMIT 1";
            $stmt = $connection->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
        } while ($result->num_rows > 0);

        $query = "INSERT INTO " . TBL_TRANSMUTATIONS . "(
            teacher_uid,
            uid,
            name,
            lowest,
            passing,
            highest,
            is_default,
            created_at,
            updated_at
        ) VALUES (?,?,?,?,?,?,0,NOW(),NOW())";

        $stmt = $connection->prepare($query);
        $stmt->bind_param(
            "ssssss",
            $_SESSION["uid"],
            $newUID,
            $this->data->name,
            $this->data->lowest,
            $this->data->passing,
            $this->data->highest,
        );
        $stmt->execute();
        $stmt->close();

        http_response_code(200);
        echo parent::createResponse(200, "Add Request Successful", "Add Request Successful", "", "");
        exit();
    }

    public function Update()
    {
        global $connection;

        $this->RequestCheck($this->request);

        if (empty($this->data->id) || $this->data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Update Failed", "A Request Data is Empty", "ID is Empty", "");
            exit();
        }

        $query = "UPDATE " . TBL_TRANSMUTATIONS . " SET
            name = ?,
            lowest = ?,
            passing = ?,
            highest = ?,
            updated_at = NOW()
        WHERE uid = ? AND teacher_uid = ? AND is_default = 0";
        $stmt = $connection->prepare($query);
        $stmt->bind_param(
            "ssssss",
            $this->data->name,
            $this->data->lowest,
            $this->data->passing,
            $this->data->highest,
            $this->data->id,
            $_SESSION["uid"]

        );
        $stmt->execute();
        $result = $stmt->affected_rows;
        $stmt->close();

        if ($result === 0) {
            http_response_code(400);
            echo parent::createResponse(400, "Update Failed", "Request Unauthorized", "", "");
            exit();
        }

        http_response_code(200);
        echo parent::createResponse(200, "Update Request Successful", "Update Request Successful", "", "");
        exit();
    }

    public function Destroy()
    {
        global $connection;

        $this->RequestCheck($this->request);

        if (empty($this->data->id) || $this->data->id === null) {
            http_response_code(400);
            echo parent::createResponse(400, "Delete Failed", "A Request Data is Empty", "ID is Empty", "");
            exit();
        }

        $query = "DELETE FROM " . TBL_TRANSMUTATIONS . " WHERE uid = ? AND teacher_uid = ? AND is_default = 0";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("ss", $this->data->id, $_SESSION["uid"]);
        $stmt->execute();
        $result = $stmt->affected_rows;
        $stmt->close();

        if ($result === 0) {
            http_response_code(400);
            echo parent::createResponse(400, "Delete Failed", "Request Unauthorized", "", "");
            exit();
        }

        http_response_code(200);
        echo parent::createResponse(200, "Delete Request Successful", "Delete Request Successful", "", "");
        exit();

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

if (isset($_GET['index'])) {

    $transmutation = new Transmutation(json_decode($_GET['index']));

    $transmutation->Index();

}

if (isset($_POST['store'])) {

    $transmutation = new Transmutation(json_decode($_POST['store']));

    $transmutation->Store();
}

if (isset($_POST['destroy'])) {

    $transmutation = new Transmutation(json_decode($_POST['destroy']));

    $transmutation->Destroy();
}

if (isset($_POST['update'])) {

    $transmutation = new Transmutation(json_decode($_POST['update']));

    $transmutation->Update();
}