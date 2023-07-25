<?php

/*
    ! DO NOT CLOSE THE DB CONNECTION HERE
    ! check $connection variable at config.php
*/



function queryOneRow($table, $column, $find)
{
    global $connection;
    $query = "SELECT * FROM $table WHERE $column = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $find);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    return $rows;
}

function queryOneRowCount($table, $column, $find)
{
    global $connection;
    $query = "SELECT * FROM $table WHERE $column = ?";

    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $find);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result->num_rows;
}

function queryOneRowOneColumn($table, $column, $search, $find)
{
    global $connection;
    $query = "SELECT {$column} FROM {$table} WHERE {$search} = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $find);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    return $rows;
}

function queryOneRowOneColumnCount($table, $column, $search, $find)
{
    global $connection;
    $query = "SELECT {$column} FROM {$table} WHERE {$search} = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("s", $find);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result->num_rows;
}

function verifyPassword($table, $credential = "", $password = "")
{
    global $connection;

    $query = "SELECT password FROM $table WHERE email = ? OR username = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ss", $credential, $credential);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $stmt->close();
        return password_verify($password, $row['password']);
    }
    $stmt->close();
    return false;
}