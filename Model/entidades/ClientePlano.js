const Database = require("../database");

const db = Database.getInstance();

class ClientePlanoModel {
    constructor({ cli_id = null, pla_id = null, formapagamento = null, data=null} = {}) {
        this.cli_id = cli_id;
        this.pla_id = pla_id;
        this.formapagamento = formapagamento;
        this.data = data;
    }

    // Inserir uma nova relação entre cliente e plano
    static async associar(clientePlano) {
        const sql = 'INSERT INTO cliente_plano (cli_id, pla_id,formadepagamento,data) VALUES (?,?,?,?)';
        const params = [clientePlano.cli_id, clientePlano.pla_id, clientePlano.formapagamento,clientePlano.data];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.insertId ? new ClientePlanoModel(clientePlano) : null;
    }

    // Consultar todas as relações entre cliente e plano
    static async ObterTodos() {
        const sql = 'SELECT * FROM cliente_plano';
        const results = await db.executaComando(sql);
        return results.map(row => new ClientePlanoModel(row));
    }


    static async ObterPorClienteEPlano(cli_id, pla_id) {
        const sql = 'SELECT * FROM cliente_plano WHERE cli_id = ? AND pla_id = ?';
        const params = [cli_id, pla_id];
        const results = await db.executaComando(sql, params);
        return results.length > 0 ? new ClientePlanoModel(results[0]) : null;
    }

    // Excluir uma relação entre cliente e plano
    static async Excluir(cli_id, pla_id) {
        const sql = 'DELETE FROM cliente_plano WHERE cli_id = ? AND pla_id = ?';
        const params = [cli_id, pla_id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }

    static async VendasMensal(dataInicio, dataFim) {
        try {
            // Consulta SQL atualizada para considerar um intervalo de datas
            const sql = `
                SELECT 
                    p.pla_nome, 
                    COUNT(cp.pla_id) AS total_vendas,
                    SUM(CAST(REPLACE(p.pla_valor, 'R$', '') AS DECIMAL(10, 2))) AS total_valor_vendas
                FROM 
                    cliente_plano cp
                JOIN 
                    planos p ON cp.pla_id = p.pla_id
                WHERE 
                    cp.data BETWEEN ? AND ? 
                GROUP BY 
                    p.pla_nome
                ORDER BY 
                    total_vendas DESC;
            `;
    
            // Executa a consulta passando os parâmetros do período (dataInicio e dataFim)
            const rows = await db.executaComando(sql, [dataInicio, dataFim]);
    
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

module.exports = ClientePlanoModel;
