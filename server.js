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
const agendamento = require('./Routers/AgendamentoRoutes');
const authenticateToken = require('./Midd/authenticateToken');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Rotas
app.use('/clientes',clienteRotas);
app.use('/salas',salasRotas);
app.use('/planos',planosRotas);
app.use('/horarios',horariosRotas);
app.use('/associar',associarplanos);
app.use('/agendamento',agendamento);

// Adiciona o middleware de autenticação somente para as rotas protegidas
app.use('/funcionarios', funcionariosRotas);

app.listen(port, '0.0.0.0', () => console.log(`Servidor rodando na porta ${port}`));

