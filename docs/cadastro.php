<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="stylesheet" href="cadastro.css">
    <title>Cadastro</title>
</head>
<body>
    <header class="header">
        <div><img class="senacine" src="senacine.png" alt=""></div>
        <div>
           <h3 class="prog">PROGRAMAÇÃO</h3>
        </div>
        <div>
           <h3 class="filmes-2">FILMES</h3>
        </div>
        <div>
           <h3 class="comidas-2">COMIDAS</h3>
        </div>
        <div>
           <h3 class="cadas-2">CADASTRE-SE</h3>
        </div>
  
     </header>
     <main class="wrapper">
         <span class="icon-close"><img src="icons8-x-48.png" alt=""></span>

         <div class="form-box login">
            <h2>Login</h2>
            <form action="#">
                <div class="input-box">
                    <span class="icon"></span>
                    <input type="email" required>
                    <label>Email</label>
                </div>
                <div class="input-box">
                    <span class="icon"></span>
                    <input type="senha" required>
                    <label>Senha</label>
                </div>
                <div class="remerber-forgot">
                    <label><input type="checkbox">Remember me</label>
                    <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" class="btn">Login</button>
                <div class="login-register">
                    <p>Don´t have an account?<a href="#" class="register-link">Register</a></p>
                </div>
            </form>
         </div>

         <div class="form-box register">
            <h2>Registration</h2>
            <form action="registro.php" method="post">
                <div class="input-box">
                    <span class="icon"></span>
                    <input type="text" name="username" required>
                    <label>Username</label>
                </div>
                <div class="input-box">
                    <span class="icon"></span>
                    <input type="email" name="email" required>
                    <label>Email</label>
                </div>
                <div class="input-box">
                    <span class="icon"></span>
                    <input type="senha" name="senha" required>
                    <label>Senha</label>
                </div>
                <div class="remerber-forgot">
                    <label><input type="checkbox">I agree to the terms e conditions</label>
                    
                </div>
                <button type="submit" class="btn">Register</button>
                <div class="login-register">
                    <p>Already have an account?<a href="#" class="login-link">Login</a></p>
                </div>
            </form>
         </div>
     </main>
     <script src="cadastro.js"></script>
</body>
</html>