const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { ObjectId } = require('mongodb');

// Configurações do MongoDB
const uri = 'mongodb+srv://gustavo:iVgSBgVZEoXGpQqV@espcex.ak1fufz.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
const dbName = 'cadastro';


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de cadastro

app.post('/cadastrar', async (req, res) => { 
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validações
    if (!name || !email || !password || password !== confirmPassword) {
      return res.status(400).json({ message: 'Dados inválidos ou senhas não coincidem.' });
    }

    // Conecta ao banco de dados
    await client.connect();
    const db = client.db(dbName);  // Corrigido: Use dbName em vez de myDatabase
    const collection = db.collection('users');

    // Verifica se o usuário já existe
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o novo usuário com a senha criptografada
    const result = await collection.insertOne({ name, email, password: hashedPassword });

    res.status(200).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertedId });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    // Fechar a conexão após o processamento
    await client.close();
  }
});



// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // Conecta ao banco de dados
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Verifica se o usuário existe
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Verifica se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Cria um token JWT com o id do usuário
    const token = jwt.sign({ userId: user._id }, 'seu-segredo-aqui', { expiresIn: '1h' });

    // Retorna uma resposta com o token de autenticação e o nome do usuário
    res.status(200).json({ 
      message: 'Login bem-sucedido', 
      token,
      name: user.name // Adiciona o nome do usuário na resposta
    });
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    await client.close();
  }
});




// Rota de cadastro de contas
app.post('/cadastrar/contas', async (req, res) => {
  try {
    const { titulo, categoria, valor, data } = req.body;

    // Validações
    if (!titulo || !categoria || !valor || !data) {
      return res.status(400).json({ message: 'Dados inválidos.' });
    }
    // Conecta ao banco de dados
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('lancamentos');

    const result = await collection.insertOne({ titulo, categoria, valor, data });
    res.status(200).json({ message: 'Lançamento cadastrado com sucesso!', id: result.insertedId });
  } catch (error) {
    console.error('Erro ao cadastrar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});



//contas  lancamentos
app.get('/lancamentos', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('lancamentos');

    // Obtém todos os lançamentos do banco de dados
    const lancamentos = await collection.find().toArray();
    res.status(200).json(lancamentos);
    
  } catch (error) {
    console.error('Erro ao buscar lançamentos:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar lançamentos.' });
  } finally {
    await client.close();
  }
});




// Rota para excluir uma transação
app.delete('/lancamentos/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID recebido no backend:', id); // Verifique o valor do ID

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido ou ausente.' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('lancamentos');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Lançamento não encontrado.' });
    }

    res.status(200).json({ message: 'Lançamento excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    await client.close();
  }
});




//Rota para obter o nome do usuário:
app.get('/usuario', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token Bearer
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, 'seu-segredo-aqui');
    const userId = decoded.userId;

    // Conecta ao banco de dados
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Busca o usuário pelo ID
    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna o nome do usuário
    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  } finally {
    await client.close();
  }
});
















/* Rota para editar uma transação
app.get('/lancamentos/:id', async (req, res) => {
  const { id } = req.params;

  // Valida o ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido ou ausente.' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('lancamentos');

    // Busca o lançamento
    const lancamento = await collection.findOne({ _id: new ObjectId(id) });

    if (!lancamento) {
      return res.status(404).json({ message: 'Lançamento não encontrado.' });
    }

    res.status(200).json(lancamento);
  } catch (error) {
    console.error('Erro ao buscar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    await client.close();
  }
});*/




// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});