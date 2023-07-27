const Payment = require("../db/mongo/models/Payment.js");
const { connectToDatabase, closeDatabaseConnection } = require('../db/mongo/index');

async function createPaymentDocument(payment) {
    let paymentCollection = null;

    try {
        const user = await payment.getUser();
        paymentCollection = await connectToDatabase();

        const paymentData = new Payment({
            payment_id: payment.id,
            merchant: {
                company_name: user.company_name,
                role: user.role,
                id: user.uuid,
                email: user.email
            },
            order_field: {
                id: payment.order_field,
            },
            client_field: {
                id: payment.client_field,
            },
            total: payment.total,
            currency: payment.currency,
            status: payment.status,
            created_date: payment.createdAt,
        });

        await paymentCollection.insertOne(paymentData);
        console.log("Payment document added to MongoDB");
    } catch (error) {
        console.error("Error creating payment document:", error);
    } finally {
        await closeDatabaseConnection();
    }
}

async function updatePaymentDocument(payment) {
    let paymentCollection = null;

    try {
        paymentCollection = await connectToDatabase();

        const { status } = payment;

        const paymentDocument = await paymentCollection.findOne({ payment_id: payment.id.toString() });

        if (!paymentDocument) {
            console.log("Payment document not found");
            return;
        }

        if (paymentDocument.status !== status) {
            await paymentCollection.updateOne({ payment_id: payment.id.toString() }, { $set: { status } });
            console.log("Payment document updated successfully");
        } else {
            console.log("Payment document status is the same. No update needed.");
        }
    } catch (error) {
        console.error("Error updating payment document:", error);
    } finally {
        await closeDatabaseConnection();
    }
}

async function createOperationOnPaymentDocument(operation) {
    let paymentCollection = null;

    try {
        paymentCollection = await connectToDatabase();

        const operationData = {
            id: operation.id.toString(),
            amount: operation.amount,
            type: operation.type,
            status: operation.status,
            created_date: operation.createdAt
        };

        await paymentCollection.updateOne(
            { payment_id: operation.PaymentId.toString() },
            { $push: { operations: operationData } }
        );
        console.log("Operation added to MongoDB");
    } catch (error) {
        console.error("Error updating payment document:", error);
    } finally {
        await closeDatabaseConnection();
    }
}

async function updateOperationOnPaymentDocument(operation) {
    let paymentCollection = null;

    try {
        paymentCollection = await connectToDatabase();

        const paymentDocument = await paymentCollection.findOne({ payment_id: operation.PaymentId.toString() });

        if (!paymentDocument) {
            console.error("Payment document not found for PaymentId:", operation.PaymentId);
            return;
        }

        const operationToUpdate = paymentDocument.operations.find(op => {
            return parseInt(op.id) === operation.id
        });

        if (!operationToUpdate) {
            console.error("Operation not found for OperationId:", operation.id);
            return;
        }

        if (operationToUpdate.status !== operation.status) {
            await paymentCollection.updateOne(
                { "operations.id": operation.id },
                { $set: { "operations.$.status": operation.status } }
            );

            console.log("Operation updated successfully");
        } else {
            console.log("Operation status is the same. No update needed.");
        }
    } catch (error) {
        console.error("Error updating operations:", error);
    } finally {
        await closeDatabaseConnection();
    }
}

module.exports = { createPaymentDocument, updatePaymentDocument, createOperationOnPaymentDocument, updateOperationOnPaymentDocument };