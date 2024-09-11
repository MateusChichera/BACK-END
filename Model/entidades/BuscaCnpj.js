const axios = require('axios');

class ReceitaWSService {
    static async buscarCNPJ(cnpj) {
        const url = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao consultar a API da ReceitaWS');
        }
    }
}

module.exports = ReceitaWSService;
