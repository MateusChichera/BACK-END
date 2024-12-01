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
}

module.exports = ClientePlanoModel;
