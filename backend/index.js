
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware para parsear JSON do corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const { 
        email,
        user_type,
        name,
        cpf_or_cnpj,
        birth_date,
        phone,
        password,
    } = req.body;

    // Validação dos dados recebidos
    if (!email || !user_type || !name || !cpf_or_cnpj || !birth_date || !phone || !password) {
        return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' });
    }

    res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});