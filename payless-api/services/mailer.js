const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.MAIL_API_KEY
const ServiceError = require('../errors/ServiceError');
const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');
const loader = new TwingLoaderFilesystem('./views/emails'); // from root
const twing = new TwingEnvironment(loader);

const sendRegistrationMail = async (to) => {
    const subject = 'Your account is under validation';
    const htmlContent = await twing.render('registration.twig');
    return await sendEmail(to, subject, htmlContent);
};

const sendValidationMail = async (to) => {
    const subject = 'Your account has been validated!';
    const htmlContent = await twing.render('account-validated.twig', {loginUrl: process.env.LOGIN_URL});
    return await sendEmail(to, subject, htmlContent);
};

const sendRefusedMail = async (to) => {
    const subject = 'Your account has been refused';
    const htmlContent = await twing.render('account-refused.twig');
    return await sendEmail(to, subject, htmlContent);
}

const sendEmail = async (to, subject, htmlContent) => {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: 'no-reply@payless.com',
        name: 'Payless',
    };

    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
        to = process.env.TEST_EMAIL;
    }

    if (!to) {
        throw new ServiceError('No test email provided');
    }

    return await tranEmailApi
        .sendTransacEmail({
            sender,
            to: [{
                email: to,
            }],
            subject,
            htmlContent,
        });
}

module.exports = {
    sendRegistrationMail,
    sendValidationMail,
    sendRefusedMail,
    sendEmail
};
