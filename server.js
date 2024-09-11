require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 4001;

// Importa as rotas
const clienteRotas = require('./Routers/ClienteRoutes');
const salasRotas = require('./Routers/SalasRoutes');
const planosRotas = require('./Routers/PlanosRoutes');
const horariosRotas = require('./Routers/HorariosRoutes');
const funcionariosRotas = require('./Routers/FuncionarioRoutes');
const associarplanos = require('./Routers/ClientePlanoRoutes');
const authenticateToken = require('./Midd/authenticateToken');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Rotas
app.use('/clientes',authenticateToken,clienteRotas);
app.use('/salas',authenticateToken,salasRotas);
app.use('/planos', authenticateToken,planosRotas);
app.use('/horarios', authenticateToken,horariosRotas);
app.use('/associar', authenticateToken,associarplanos);

// Adiciona o middleware de autenticação somente para as rotas protegidas
app.use('/funcionarios', funcionariosRotas);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
