const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'masterkey',
            database: 'projetofinal'
        });
    }

    async executaComando(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, params);
            return rows;
        } finally {
            connection.release();
        }
    }

    async executaComandoNonQuery(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [result] = await connection.query(sql, params);
            return result;  // Retorna o objeto completo, incluindo affectedRows
        } finally {
            connection.release();
        }
    }
    
}

module.exports = Database;
