const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true }
});

const orderFieldSchema = new mongoose.Schema({
    Id: { type: String, required: true }
});

const clientFieldSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
});

const operationsSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
});

const operationSchema = new mongoose.Schema({
    payment_id: { type: String, required: true },
    merchant: merchantSchema,
    order_field: orderFieldSchema,
    client_field: clientFieldSchema,
    total: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    operations: [operationsSchema]
});

const Operation = mongoose.model('Operation', operationSchema);