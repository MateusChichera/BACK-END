const Database = require("../database");
const axios = require('axios');

const db = new Database;

class ClienteModel {
    constructor({
        cli_id = null,
        cli_tipo = '',
        cli_cpf = '',
        cli_cnpj = '',
        cli_nome = '',
        cli_data_nascimento = null,
        cli_cep = '',
        cli_end = '',
        cli_num = null,
        cli_bairro = '',
        cli_cid = '',
        cli_uf = '',
        cli_email = '',
        cli_fantasia = '',
        cli_razao = '',
        cli_tel = ''
    } = {}) {
        this.cli_id = cli_id;
        this.cli_tipo = cli_tipo;
        this.cli_cpf = cli_cpf;
        this.cli_cnpj = cli_cnpj;
        this.cli_nome = cli_nome;
        this.cli_data_nascimento = cli_data_nascimento;
        this.cli_cep = cli_cep;
        this.cli_end = cli_end;
        this.cli_num = cli_num;
        this.cli_bairro = cli_bairro;
        this.cli_cid = cli_cid;
        this.cli_uf = cli_uf;
        this.cli_email = cli_email;
        this.cli_fantasia = cli_fantasia;
        this.cli_razao = cli_razao;
        this.cli_tel = cli_tel;
    }

    static async Inserir(cliente) {
        let fields = [];
        let placeholders = [];
        let values = [];

        for (let key in cliente) {
            if (cliente[key] !== null && cliente[key] !== undefined) {
                fields.push(key);
                placeholders.push('?');
                values.push(cliente[key]);
            }
        }

        const sql = `
            INSERT INTO clientes (${fields.join(', ')})
            VALUES (${placeholders.join(', ')})
        `;
            console.log("SQL:",sql);
            console.log("VALORES",values);
            
        const result = await db.executaComando(sql, values);
        console.log("Dentro da model result",result);
        cliente.cli_id = result.insertId;
        return cliente;
    }

    static async Atualizar(cliente,id) {
        let fields = [];
        let params = [];
        for (let key in cliente) {
            if (cliente[key] !== null && cliente[key] !== undefined && key !== 'cli_id') {
                fields.push(`${key} = ?`);
                params.push(cliente[key]);
            }
        }
        if (fields.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }
        const sql = `UPDATE clientes SET ${fields.join(', ')} WHERE cli_id = ?`;
        params.push(cliente.cli_id);
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    static async Excluir(cli_id) {
        const sql = `DELETE FROM clientes WHERE cli_id = ?`;
        const params = [cli_id];
        await db.executaComandoNonQuery(sql, params);
    }
    static async Busca(cli_nome) {
        const sql = `SELECT * FROM clientes WHERE cli_nome LIKE ? OR cli_razao LIKE ? OR cli_cpf LIKE ? OR cli_cnpj LIKE ?`;
        const params = [`%${cli_nome}%`, `%${cli_nome}%`,`%${cli_nome}%`,`%${cli_nome}%`]; // Usamos % para indicar que o nome pode ter qualquer combinação de caracteres antes ou depois da string de busca
        const results = await db.executaComando(sql, params);
        if (results.length > 0) {
            return results.map(row => new ClienteModel(row)); // Mapeia os resultados para objetos ClienteModel
        } else {
            return null;
        }
    }
    static async BuscaID(id) {
        const sql = `SELECT * FROM clientes WHERE cli_id = ?`;
        const params = [id]; 
        const results = await db.executaComando(sql, params);
    
        // Se a consulta retornar resultados, retorna o primeiro item
        if (results && results.length > 0) {
            return results[0];  // Retorna o primeiro cliente (caso haja algum)
        }
        
        // Caso não tenha encontrado o cliente
        return null;
    }
    
    
        static async buscarCNPJ(cnpj) {
            const url = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                throw new Error('Erro ao consultar a API da ReceitaWS');
            }
        }
    
    

    static async ObterTodos() {
        const sql = `SELECT * FROM clientes`;
        const results = await db.executaComando(sql);
        return results.map(row => new ClienteModel(row));
    }
}

module.exports= ClienteModel;