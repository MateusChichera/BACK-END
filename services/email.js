const nodemailer = require('nodemailer');

class EmailService {
    // Função para configurar o transporte de e-mail
    static criarTransportador() {
        // Configuração do transporte do Nodemailer (Exemplo com Gmail)
        const transportador = nodemailer.createTransport({
            service: 'gmail',  // Pode ser outro serviço, como Outlook, Yahoo, etc.
            auth: {
                user: 'seuemail@gmail.com',  // Substitua pelo seu e-mail
                pass: 'sua-senha'  // Substitua pela sua senha de e-mail ou senha de app
            }
        });

        return transportador;
    }

    // Função para enviar o e-mail
    static async enviarEmail(to, assunto, mensagem) {
        try {
            // Cria o transportador
            const transportador = EmailService.criarTransportador();

            // Configuração do e-mail
            const mailOptions = {
                from: 'seuemail@gmail.com',  // Seu e-mail de envio
                to: to,  // E-mail do destinatário
                subject: assunto,  // Assunto do e-mail
                text: mensagem,  // Corpo do e-mail (texto simples)
                // Você também pode usar o formato HTML se preferir:
                // html: `<p>${mensagem}</p>`
            };

            // Envia o e-mail
            const info = await transportador.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso:', info.response);
            return info;  // Retorna a resposta do envio do e-mail
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            throw error;  // Lança o erro para ser tratado pelo controlador
        }
    }
}

module.exports = EmailService;
