<?php

function queryOneData($table, $column, $data)
{
    global $connection;
    $query = "SELECT 1 FROM $table WHERE $column = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $data);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function verifyPassword($table, $credential = "", $password = "")
{
    global $connection;

    $stmt = $connection->prepare("SELECT password FROM $table WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $credential, $credential);
    $stmt->execute();

    $result = $stmt->get_result();
    return $result && $result->num_rows > 0 && password_verify($password, $result->fetch_assoc()['password']);
}