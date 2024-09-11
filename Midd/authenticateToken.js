const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    console.log('Middleware de autenticação chamado para:', req.path);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho

    if (token == null) {
        console.log('Token não encontrado');
        return res.sendStatus(401); // Se não houver token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Erro na verificação do token:', err);
            return res.sendStatus(403); // Se o token for inválido
        }
        req.user = user; // Adiciona o usuário ao objeto de requisição
        console.log('Token válido:', user);
        next(); // Passa para o próximo middleware ou rota
    });
};

module.exports = authenticateToken;
