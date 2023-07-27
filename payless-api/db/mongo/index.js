const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URL;

let client = null;
let paymentCollection = null;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            },
        });

        try {
            await client.connect();
            console.log('Connected to MongoDB!');
            const db = client.db('payless_prod');
            paymentCollection = db.collection('payment');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    return paymentCollection;
}

async function closeDatabaseConnection() {
    if (client) {
        try {
            await client.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
            throw error;
        }
    }
}

module.exports = { connectToDatabase, closeDatabaseConnection };