
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON do corpo das requisições
app.use(bodyParser.json());

app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK',
      timestamp: new Date().toISOString()
    });
});

// Endpoint [GET] /registration
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});

// Endpoint [POST] /registration
app.post('/registration', (req, res) => {
    const { name, email, password } = req.body;

    // Validação simples dos dados recebidos
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos devem ser preenchidos' });
    }

    // Simulação de sucesso no cadastro
    res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});