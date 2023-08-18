<?php

function createResponse($status, $title, $message, $description, $data = array())
{
    $response = array(
        "status" => $status,
        "title" => $title,
        "message" => $message,
        "description" => $description,
        "data" => $data
    );

    return json_encode($response, JSON_PRETTY_PRINT);
}

function generateUID($length)
{
    $characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $sequence = '';

    for ($i = 0; $i < $length; $i++) {
        $randomIndex = random_int(0, strlen($characters) - 1);
        $sequence .= $characters[$randomIndex];
    }

    return $sequence;
}


class Functions
{

    protected function generateUID($length)
    {
        $characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $sequence = '';

        for ($i = 0; $i < $length; $i++) {
            $randomIndex = random_int(0, strlen($characters) - 1);
            $sequence .= $characters[$randomIndex];
        }

        return $sequence;
    }

    protected function createResponse($status, $title, $message, $description, $data = array())
    {
        $response = array(
            "status" => $status,
            "title" => $title,
            "message" => $message,
            "description" => $description,
            "data" => $data
        );

        return json_encode($response, JSON_PRETTY_PRINT);
    }
}