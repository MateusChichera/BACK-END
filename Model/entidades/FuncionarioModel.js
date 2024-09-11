const Database = require("../database");

const db = new Database();

class FuncionarioModel {
    constructor({
        fun_id = null,
        fun_nome = '',
        fun_senha = '',
        fun_setor = ''
    } = {}) {
        this.fun_id = fun_id;
        this.fun_nome = fun_nome;
        this.fun_senha = fun_senha;
        this.fun_setor = fun_setor;
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
        const sql = 'INSERT INTO funcionarios (fun_nome, fun_senha, fun_setor) VALUES (?, ?, ?)';
        const params = [funcionario.fun_nome, funcionario.fun_senha, funcionario.fun_setor];
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
        const sql = 'UPDATE funcionarios SET fun_nome = ?, fun_senha = ?, fun_setor = ? WHERE fun_id = ?';
        const params = [funcionario.fun_nome, funcionario.fun_senha, funcionario.fun_setor, id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    static async Excluir(fun_id) {
        const sql = 'DELETE FROM funcionarios WHERE fun_id = ?';
        const result = await db.executaComandoNonQuery(sql, [fun_id]);
        return result.affectedRows > 0;
    }
}

module.exports = FuncionarioModel;