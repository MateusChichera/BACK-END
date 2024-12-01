const Database = require("../database");
const axios = require('axios');

const db = Database.getInstance();

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

    static async Atualizar(cliente, id) {
        let fields = [];
        let params = [];
        
        // Log para verificar o cliente e ID recebidos
        console.log("Cliente para atualizar:", cliente);
        console.log("ID do cliente:", id);
        
        // Verificar o tipo de cliente e adaptar os campos a serem atualizados
        if (cliente.cli_tipo === 'CNPJ') {
            // Não incluir os campos cli_nome, cli_data_nascimento, cli_cpf
            const camposPermitidos = ['cli_tipo', 'cli_cnpj', 'cli_cep', 'cli_end', 'cli_num', 'cli_bairro', 'cli_cid', 'cli_uf', 'cli_email', 'cli_fantasia', 'cli_razao', 'cli_tel'];
            
            // Criação da lista de campos a atualizar (somente os permitidos para CNPJ)
            for (let key in cliente) {
                if (cliente[key] !== null && cliente[key] !== undefined && camposPermitidos.includes(key)) {
                    fields.push(`${key} = ?`);
                    params.push(cliente[key]);
                }
            }
        } else {
            // Para clientes CPF, inclui todos os campos, incluindo nome e data de nascimento
            for (let key in cliente) {
                if (cliente[key] !== null && cliente[key] !== undefined && key !== 'cli_id') {
                    fields.push(`${key} = ?`);
                    params.push(cliente[key]);
                }
            }
        }
        
        if (fields.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }
        
        // Montando a SQL com os campos e parâmetros
        const sql = `UPDATE clientes SET ${fields.join(', ')} WHERE cli_id = ?`;
        params.push(id);  // Usar o parâmetro 'id' em vez de cliente.cli_id
        
        // Log para verificar a SQL gerada
        console.log("SQL gerada:", sql);
        console.log("Parâmetros:", params);
        
        // Executando o comando de atualização
        const result = await db.executaComandoNonQuery(sql, params);
        
        // Verificação do resultado da atualização
        if (result.affectedRows > 0) {
            return true; // Atualização bem-sucedida
        } else {
            throw new Error('Nenhum cliente encontrado para atualizar ou nenhum dado foi alterado');
        }
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
    
        // Garantir que o retorno seja um array, com o cliente ou um array vazio
        return results && results.length > 0 ? [results[0]] : [];
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
    //RELATORIOS

    static async RelCheck() {
        try {
            // A consulta SQL para gerar o relatório de Check-in e Check-out
            const sql = `
              SELECT 
                    a.age_id, 
                    c.cli_nome, 
                    DATE_FORMAT(a.check_in, '%d/%m/%Y %H:%i:%s') AS check_in_formatado, 
                    DATE_FORMAT(a.check_out, '%d/%m/%Y %H:%i:%s') AS check_out_formatado
                FROM 
                    agendamentos a
                JOIN 
                    clientes c ON a.cli_id = c.cli_id
                WHERE 
                    (a.check_in IS NOT NULL OR a.check_out IS NOT NULL);

            `;
            const rows = await db.executaComando(sql);
            

            if (rows.length === 0) {
                console.log("Nenhum dado encontrado.");
                return []; 
            }
    
            return rows;
    
        } catch (error) {
        
            console.error('Erro ao gerar relatório de Check-in e Check-out:', error);
            throw new Error('Erro ao gerar relatório de Check-in e Check-out: ' + error.message);
        }
    }

    static async Leads() {
        try {
            const sql = `
             SELECT 
                    CASE 
                        WHEN c.cli_tipo = 'CPF' THEN c.cli_nome
                        WHEN c.cli_tipo = 'CNPJ' THEN COALESCE(c.cli_fantasia, c.cli_razao)
                    END AS cliente,
                    c.cli_tel
                FROM 
                    clientes c
                LEFT JOIN 
                    cliente_plano cp ON c.cli_id = cp.cli_id
                LEFT JOIN 
                    planos p ON cp.pla_id = p.pla_id
                WHERE 
                    cp.pla_id IS NULL;

            `;
            const rows = await db.executaComando(sql);
            

            if (rows.length === 0) {
                console.log("Nenhum dado encontrado.");
                return []; 
            }
    
            return rows;
    
        } catch (error) {
        
            console.error('Erro ao gerar relatório:', error);
            throw new Error('Erro ao gerar relatório: ' + error.message);
        }
    }

        static async ClientesPlanos() {
            try {
                const sql = `
                 SELECT 
                        CASE 
                            WHEN c.cli_tipo = 'CPF' THEN c.cli_nome
                            WHEN c.cli_tipo = 'CNPJ' THEN COALESCE(c.cli_fantasia, c.cli_razao)
                        END AS cliente,
                        c.cli_tel,
                        p.pla_nome, 
                        p.pla_valor, 
                        cp.formadepagamento
                    FROM 
                        clientes c
                    INNER JOIN 
                        cliente_plano cp ON c.cli_id = cp.cli_id
                        INNER JOIN 
                        planos p ON cp.pla_id = p.pla_id;
    
                `;
                const rows = await db.executaComando(sql);
                
    
                if (rows.length === 0) {
                    console.log("Nenhum dado encontrado.");
                    return []; 
                }
        
                return rows;
        
            } catch (error) {
            
                console.error('Erro ao gerar relatório:', error);
                throw new Error('Erro ao gerar relatório: ' + error.message);
            }
        }
    

}

module.exports= ClienteModel;