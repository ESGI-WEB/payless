const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.MAIL_API_KEY
const ServiceError = require('../errors/ServiceError');

const sendRegistrationMail = async (to) => {
    const subject = 'Your account is under validation';
    const textContent = `Before using your account, we need to validate it by checking your KBIS and your identity. Please wait for our validation email`;
    const htmlContent = `
            <html>
              <body>
                  <h1>Your account is under validation</h1>
                  <p>Before using your account, we need to validate it by checking your KBIS and your identity. Please wait for our validation email</p>
              </body>
            </html> 
        `;
    await sendEmail(to, subject, textContent, htmlContent);
};

const sendEmail = async (to, subject, textContent, htmlContent) => {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: 'no-reply@payless.com',
        name: 'Payless',
    };

    if (!process.env.PRODUCTION) {
        to = process.env.TEST_EMAIL;
    }

    if (!to) {
        throw new ServiceError('No email provided');
    }

    await tranEmailApi
        .sendTransacEmail({
            sender,
            to: [{
                email: to,
            }],
            subject,
            textContent,
            htmlContent,
        });
}

module.exports = {
    sendRegistrationMail,
    sendEmail
};
