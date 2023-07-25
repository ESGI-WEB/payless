const ValidationError = require('../errors/ValidationError');

module.exports = {
    capture: function (data) {
        const {
            card_number = null,
            cardholder_name = null,
            expiration_date = null,
            cvv = null,
            amount = null,
            currency = null,
        } = data;

        const errorsFields = {};
        if (!card_number || !card_number.trim()) {
            errorsFields['card_number'] = ['card_number is required'];
        } else if (!card_number.replaceAll(' ', '').match(/^[0-9]{16}$/)) {
            errorsFields['card_number'] = ['card_number is invalid'];
        }

        if (!cardholder_name || !cardholder_name.trim()) {
            errorsFields['cardholder_name'] = ['cardholder_name is required'];
        }

        if (!expiration_date || !expiration_date.trim()) {
            errorsFields['expiration_date'] = ['expiration_date is required'];
        } else if (!expiration_date.match(/^[0-9]{2}\/[0-9]{4}$/)) {
            errorsFields['expiration_date'] = ['expiration_date is invalid'];
        } else {
            const [month, year] = expiration_date.split('/');
            const now = new Date();
            const currentDateFormatted = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getFullYear();
            if (new Date(year, parseInt(month) - 1) < now && expiration_date !== currentDateFormatted) {
                errorsFields['expiration_date'] = ['expiration_date is passed'];
            }
        }

        if (!cvv || !cvv.trim()) {
            errorsFields['cvv'] = ['cvv is required'];
        } else if (!cvv.match(/^[0-9]{3}$/)) {
            errorsFields['cvv'] = ['cvv is invalid'];
        }

        if (!amount || !isFinite(amount) || amount <= 0) {
            errorsFields['amount'] = ['amount is invalid'];
        }

        if (!currency || !currency.trim() || !["EUR", "USD", "CHF", "GBP"].includes(currency)) {
            errorsFields['currency'] = ['currency is invalid'];
        }

        if (Object.keys(errorsFields).length > 0) {
            throw new ValidationError(errorsFields);
        }
    }
}