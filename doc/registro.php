<?php

$con = new mysqli("localhost", "root", "", "formulario-sena");

$username = $_POST['username'];
$email = $_POST['email'];
$senha = $_POST['senha'];

$insertUser = "INSERT INTO `usuarios`(`nome`, `email`, `senha`) VALUES ('$username','$email','$senha')";
$insertQuery = mysqli_query($con, $insertUser);

if(isset($insertQuery)) {
    ECHO "email cadastrado com sucesso";
}