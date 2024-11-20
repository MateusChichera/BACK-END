const axios = require('axios');

class WhatsAppService {
    // Função para formatar o número para o padrão E.164 (com o prefixo '+55' para Brasil)
    static formatarNumero(numero) {
        // Verifica se o número é válido
        if (!numero || typeof numero !== 'string') {
            throw new Error('Número de telefone inválido');
        }

        // Formata o número para o formato E.164 com o prefixo '+55' para Brasil
        return `+55${numero.replace(/\D/g, '')}`;
    }

    // Função para enviar uma mensagem pelo WhatsApp
    static async enviarMensagemWhatsApp(to, mensagem) {
        try {
            // Verifica se o número 'to' e a mensagem foram fornecidos corretamente
            if (!to || !mensagem) {
                throw new Error('Número de telefone ou mensagem não fornecidos');
            }

            // Formata o número do destinatário para o padrão E.164
            const numeroFormatado = WhatsAppService.formatarNumero(to);

            // Substitua 'your_phone_number_id' pelo ID do número de telefone do WhatsApp Business
            const phoneNumberId = '467720873095557';  // Coloque o phone number ID do WhatsApp Business
            const token = 'EAAQprFY1tFgBOx7ZCXJSXZBgaEQkPTZAYXkzCduT49ODBg88nZCcvyCZCFmZA5jmhZA1cxYVJXxX9FZBVmOv5KeUtSkH46CBJYrcYVDcwQTAirlfpDP6EVHf3osEaoHWC60wiBFKCZAZBkEw0jK7gHpKDeYvMCgV2CTZBxmOEDblua9BcJ4EZCmxZAPzuW8SAo0hUdYWMaNYsg0rlgrL1xhRGpTRloYTV67Vc6ZB2wAPHABYE8Mr4ZD';  // O token fornecido

            const url = `https://graph.facebook.com/v16.0/${phoneNumberId}/messages`;

            // Configura os parâmetros da mensagem
            const data = {
                messaging_product: 'whatsapp',
                to: numeroFormatado,  // Número do destinatário formatado
                text: { body: mensagem }  // Corpo da mensagem
            };

            // Envia a requisição para a API do WhatsApp
            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Mensagem enviada com sucesso:', response.data);
            return response.data;  // Retorna a resposta da API

        } catch (error) {
            console.error('Erro ao enviar mensagem via WhatsApp:', error.response ? error.response.data : error.message);
            throw error;  // Lança o erro para ser tratado pelo controlador
        }
    }
}

module.exports = WhatsAppService;
