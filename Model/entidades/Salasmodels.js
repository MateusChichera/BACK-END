const Database = require('../database');


const db = Database.getInstance();


class SalasModel{
        constructor({sal_id =null,sal_tipo = '', sal_nome = '', sal_andar = '',sal_cap = null, sal_obs = ''}= {}){
            this.sal_id = sal_id;
            this.sal_tipo = sal_tipo;
            this.sal_nome = sal_nome;
            this.sal_andar = sal_andar;
            this.sal_cap = sal_cap;
            this.sal_obs = sal_obs;
        }

        static async ObterTodos() {
            const sql = `SELECT * FROM salas ORDER BY sal_nome ASC `;
            const results = await db.executaComando(sql);
            return results.map(row => new SalasModel(row));
        }
        static async ObterID(id) {
            const sql = `SELECT * FROM salas WHERE sal_id = ?`;
            const params = [id]
            const results = await db.executaComando(sql,params);
            return results.map(row => new SalasModel(row));
        }
        static async ObterNome(nome){
            const sql = `SELECT * FROM salas WHERE sal_nome LIKE ?`;
            const params = [`%${nome}%`];
            const results = await db.executaComando(sql,params);
            if (results.length > 0) {
                return results.map(row => new SalasModel(row)); // Mapeia os resultados para objetos
            } else {
                return null;
            }
    
        }
    
        static async Inserir(sala) {
            const sql = `
                INSERT INTO salas (sal_tipo, sal_nome, sal_andar, sal_cap, sal_obs)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [sala.sal_tipo, sala.sal_nome, sala.sal_andar, sala.sal_cap, sala.sal_obs];
            const result = await db.executaComandoNonQuery(sql, params);
            sala.sal_id = result.insertId;
            return sala;
        }
    
        static async Atualizar(sala,id) {
            const sql = `
                UPDATE salas
                SET sal_tipo = ?, sal_nome = ?, sal_andar = ?, sal_cap = ?, sal_obs = ?
                WHERE sal_id = ?
            `;
            const params = [sala.sal_tipo, sala.sal_nome, sala.sal_andar, sala.sal_cap, sala.sal_obs, id];
            const result = await db.executaComandoNonQuery(sql, params);
            return result.affectedRows > 0;
        }
    
        static async Excluir(sal_id) {
            const sql = `DELETE FROM salas WHERE sal_id = ?`;
            const result = await db.executaComandoNonQuery(sql, [sal_id]);
            return result.affectedRows > 0;
        }

        //RELATORIOS

        static async RelUti(){
            const sql = `SELECT 
                        a.age_id, 
                        DATE_FORMAT(a.age_data, '%d/%m/%Y') AS age_data_formatada,  -- Formata a data
                        DATE_FORMAT(a.age_horario_inicio, '%d/%m/%Y %H:%i:%s') AS age_horario_inicio_formatado,  -- Formata a hora de início
                        DATE_FORMAT(a.age_horario_fim, '%d/%m/%Y %H:%i:%s') AS age_horario_fim_formatado,  -- Formata a hora de fim
                        s.sal_nome, 
                        c.cli_nome, 
                        a.age_status 
                        FROM 
                        agendamentos a
                        JOIN 
                        salas s ON a.sal_id = s.sal_id
                        JOIN 
                        clientes c ON a.cli_id = c.cli_id;
                                                            `;
        const results = await db.executaComando(sql);
        if (results.length > 0) {
            return results
        } else {
            return null;
        }
        }
    }
    
    module.exports = SalasModel;