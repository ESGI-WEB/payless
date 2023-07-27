const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true }
});

const orderFieldSchema = new mongoose.Schema({
    id: { type: String, required: true }
});

const clientFieldSchema = new mongoose.Schema({
    id: { type: String, required: true }
});

const operationsSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    created_date: { type: Date, required: true }
});

const paymentSchema = new mongoose.Schema({
    payment_id: { type: String, required: true },
    merchant: merchantSchema,
    order_field: orderFieldSchema,
    client_field: clientFieldSchema,
    created_date: { type: Date, required: true },
    total: { type: String, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    operations: [operationsSchema]
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;