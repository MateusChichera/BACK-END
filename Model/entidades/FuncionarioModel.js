const Database = require("../database");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');


const db = new Database();

class FuncionarioModel {
    constructor({
        fun_id = null,
        fun_nome = '',
        fun_senha = '',
        fun_setor = '',
        fun_email = ''
    } = {}) {
        this.fun_id = fun_id;
        this.fun_nome = fun_nome;
        this.fun_senha = fun_senha;
        this.fun_setor = fun_setor;
        this.fun_email = fun_email;
    }
    static async trocarSenha(novaSenha, id) {
        console.log('novaSenha:', novaSenha, 'id:', id);
    
        const sqlAtualizarSenha = 'UPDATE funcionarios SET fun_senha = ? WHERE fun_id = ?';
        const paramsAtualizarSenha = [novaSenha, id];
        const updateResult = await db.executaComandoNonQuery(sqlAtualizarSenha, paramsAtualizarSenha);
    
        if (updateResult.affectedRows > 0) { 
            return { message: 'Senha atualizada com sucesso.' };
        } else {
            throw new Error('Nenhum registro foi afetado. Verifique se o ID é válido.');
        }
    }
    
    static async Autenticar(senha, id) {
        const sql = 'SELECT * FROM funcionarios WHERE fun_id = ? AND fun_senha = ?';
        const params = [id, senha];
        const results = await db.executaComando(sql, params);
        return results.map(row => new FuncionarioModel(row));
    }

    static async ObterTodos() {
        const sql = 'SELECT * FROM funcionarios';
        const results = await db.executaComando(sql);
        return results.map(row => new FuncionarioModel(row));
    }

    static async ObterID(id) {
        const sql = 'SELECT * FROM funcionarios WHERE fun_id = ?';
        const results = await db.executaComando(sql, id);
        return results.map(row => new FuncionarioModel(row));
    }

    static async Inserir(funcionario) {
        const sql = 'INSERT INTO funcionarios (fun_nome, fun_senha, fun_setor,fun_email) VALUES (?, ?, ?,?)';
        const params = [funcionario.fun_nome, funcionario.fun_senha, funcionario.fun_setor, funcionario.fun_email];
        const result = await db.executaComandoNonQuery(sql, params);
        funcionario.fun_id = result.insertId;
        return funcionario;
    }

    static async ObterNome(nome) {
        const sql = `SELECT * FROM funcionarios WHERE fun_nome LIKE ?`;
        const params = [`%${nome}%`];
        const results = await db.executaComando(sql, params);
        return results.length > 0 ? results.map(row => new FuncionarioModel(row)) : null;
    }

    static async Atualizar(funcionario, id) {
        const sql = 'UPDATE funcionarios SET fun_nome = ?, fun_senha = ?, fun_setor = ?,fun_email = ? WHERE fun_id = ?';
        const params = [funcionario.fun_nome, funcionario.fun_senha, funcionario.fun_setor,funcionario.fun_email, id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    static async Excluir(fun_id) {
        const sql = 'DELETE FROM funcionarios WHERE fun_id = ?';
        const result = await db.executaComandoNonQuery(sql, [fun_id]);
        return result.affectedRows > 0;
    }
    //---------------------------------------------------------------------------------------------TROCA DE SENHA POR EMAIL-------------------------------------------------------------------------

    static async BuscarPorEmail(email) {
        const sql = 'SELECT * FROM funcionarios WHERE fun_email = ?';
        const results = await db.executaComando(sql, [email]);
        return results.length > 0 ? new FuncionarioModel(results[0]) : null;
    }

    static async RedefinirSenha(email) {
        const funcionario = await this.BuscarPorEmail(email);
        if (!funcionario) {
            throw new Error('E-mail não encontrado.');
        }
    
        // Gera uma nova senha temporária
        const novaSenha = crypto.randomBytes(6).toString('hex'); // Senha com 6 caracteres aleatórios
    
        // Atualiza a senha no banco de dados
        const sqlAtualizarSenha = 'UPDATE funcionarios SET fun_senha = ? WHERE fun_email = ?';
        const paramsAtualizarSenha = [novaSenha, email];
        const result = await db.executaComandoNonQuery(sqlAtualizarSenha, paramsAtualizarSenha);
    
        if (result.affectedRows === 0) {
            throw new Error('Erro ao atualizar a senha.');
        }
    
        // Configuração do SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
        // Configura o e-mail a ser enviado
        const msg = {
            to: email, // E-mail do destinatário
            from: 'sistemacowork@gmail.com', // E-mail verificado do SendGrid
            subject: 'Redefinição de Senha',
            text: `Olá, ${funcionario.fun_nome}! Sua nova senha é: ${novaSenha}. Recomendamos que você faça login e altere essa senha temporária o mais rápido possível.`,
            html: `<p>Olá, ${funcionario.fun_nome}!</p><p>Sua nova senha é: <strong>${novaSenha}</strong></p><p>Recomendamos que você faça login e altere essa senha temporária o mais rápido possível.</p>`
        };
    
        // Envia o e-mail usando SendGrid
        await sgMail.send(msg);
    
        return { message: 'Senha redefinida com sucesso. Verifique seu e-mail.' };
    }
    
}

module.exports = FuncionarioModel;