const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

 // Substitua pelo nome do seu banco de dados
db.users.getIndexes();

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://gustavo:1WbxJFDgkqxJTI7g@espcex.ak1fufz.mongodb.net/myDatabase?retryWrites=true&w=majority')
/* 1WbxJFDgkqxJTI7g*/    
.then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));
    db.users.createIndex({ email: 1 }, { unique: true });
// Definir o esquema e modelo para o usuário
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Endpoint para cadastrar um novo usuário
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        if (error.code === 11000) { // Código de erro de duplicação de índice
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }
        // Para outros tipos de erro
        res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});