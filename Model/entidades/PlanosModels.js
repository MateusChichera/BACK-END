const Database = require("../database");


const db = new Database;

class PlanosModel{

    constructor({pla_id = null,pla_nome = '',pla_valor='', pla_dias = null} = {}){
        this.pla_id = pla_id;
        this.pla_nome = pla_nome;
        this.pla_valor = pla_valor;
        this.pla_dias = pla_dias ;

    }

    static async ObterTodos(){
        const sql = 'SELECT * FROM planos'
        const results = await db.executaComando(sql);
        return results.map(row => new PlanosModel(row));
    }
    static async ObterID(id){
        const sql = 'SELECT * FROM planos WHERE pla_id  = ?'
        const results = await db.executaComando(sql,id);
        return results.map(row => new PlanosModel(row));
    }

    static async Inserir(Plano){
        const sql = 'INSERT INTO planos (pla_nome, pla_valor,pla_dias) values (?,?,?)';
        const params = [Plano.pla_nome,Plano.pla_valor, Plano.pla_dias]
        const result = await db.executaComandoNonQuery(sql,params);
        Plano.pla_id = result.insertId;
        return Plano;
    }
    static async ObterNome(nome){
        const sql = `SELECT * FROM planos WHERE pla_nome LIKE ?`;
        const params = [`%${nome}%`];
        const results = await db.executaComando(sql,params);
        if (results.length > 0) {
            return results.map(row => new PlanosModel(row)); // Mapeia os resultados para objetos
        } else {
            return null;
        }

    }

    static async Atualizar(Plano,id){
        const sql = 'UPDATE planos SET pla_nome = ?, pla_valor = ?, pla_dias = ? WHERE pla_id = ?'
        const params = [Plano.pla_nome,Plano.pla_valor,Plano.pla_dias,id];
        const result = await db.executaComandoNonQuery(sql,params);
        return result.affectedRows >0;
    }
    static async Excluir(pla_id){
        const sql = 'DELETE FROM planos WHERE pla_id= ?'
        const result = await db.executaComandoNonQuery(sql, [pla_id]);
        return result.affectedRows > 0
    }
}


module.exports = PlanosModel;