const FuncionarioModel = require('../Model/entidades/FuncionarioModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class FuncionarioController {

    async Obter(req, res) {
        try {
            const funcionarios = await FuncionarioModel.ObterTodos();
            return res.status(200).json(funcionarios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter funcionários", error: error.message });
        }
    }
    async Autenticar(req, res) {
        console.log('JWT Secret:', process.env.JWT_SECRET)
        try {
            const { senha, id } = req.body;
            console.log(senha, id);

            // Aqui você faz a autenticação com a sua lógica existente
            const funcionario = await FuncionarioModel.Autenticar(senha, id);
            if (funcionario.length > 0) {
                // Dados do funcionário que serão incluídos no token
                const payload = {
                    id: funcionario[0].fun_id, // Usando fun_id do funcionário
                    nome: funcionario[0].fun_nome // Usando fun_nome do funcionário
                };

                // Criação do token JWT
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Retornando o token no response
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
                res.json({ message: 'Login bem-sucedido', token, nome: funcionario[0].fun_nome });
            } else {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Erro ao autenticar funcionário", error: error.message });
        }
    }


    async ObterID(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await FuncionarioModel.ObterID(id);
            return res.status(200).json(funcionario);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter funcionário", error: error.message });
        }
    }

    async ObterNome(req, res) {
        try {
            const nome = req.params.busca;
            const funcionarios = await FuncionarioModel.ObterNome(nome);
            return res.status(200).json(funcionarios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionários", error: error.message });
        }
    }

    async Inserir(req, res) {
        try {
            const funcionario = new FuncionarioModel(req.body);
            console.log("dentro da controller", funcionario);

            const FuncionarioInserido = await FuncionarioModel.Inserir(funcionario);
            return res.status(200).json(FuncionarioInserido);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao inserir funcionário", error: error.message });
        }
    }

    async Atualizar(req, res) {
        try {
            const { id } = req.params;
            const funcionario = new FuncionarioModel(req.body);
            console.log("ID:", id);
            console.log("Funcionário", funcionario);
            const FuncionarioAtualizado = await FuncionarioModel.Atualizar(funcionario, id);
            return res.status(200).json({ message: "Funcionário atualizado com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar funcionário", error: error.message });
        }
    }

    async Excluir(req, res) {
        try {
            const { id } = req.params;
            await FuncionarioModel.Excluir(id);
            return res.status(200).json({ message: "Funcionário excluído com sucesso!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir funcionário", error: error.message });
        }
    }
}

module.exports = FuncionarioController;