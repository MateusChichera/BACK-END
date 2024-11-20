const twilio = require('twilio');

// Configuração do Twilio
const client = twilio('ACf305fb5c8d59cfb79028deec7074bc90', 'efdd51455fffdfca294ef0d9f6ff907f');

class TwilioService {
    // Função para formatar o número para o padrão E.164
    static formatarNumero(numero) {
        // Verifica se o número é válido
        if (!numero || typeof numero !== 'string') {
            throw new Error('Número de telefone inválido');
        }

        // Formata o número para o formato E.164 (com o prefixo '+55' para Brasil)
        return `+55${numero.replace(/\D/g, '')}`;
    }

    // Função para enviar SMS
    static async enviarMensagemSMS(to, mensagem) {
        try {
            // Verifica se o número 'to' foi passado corretamente
            if (!to) {
                throw new Error('Número de telefone não fornecido');
            }

            // Formata o número de telefone para o padrão E.164
            const numeroFormatado = TwilioService.formatarNumero(to);

            const message = await client.messages.create({
                body: mensagem,  // Corpo da mensagem
                from: '+12029521346',  // Número de origem do Twilio
                to: numeroFormatado,  // Número do destinatário formatado
            });

            console.log('Mensagem enviada com sucesso:', message.sid);
            return message;  // Retorna a resposta da mensagem enviada
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            throw error;  // Lança o erro para ser tratado pelo controlador
        }
    }
}

module.exports = TwilioService;
