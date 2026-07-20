const mongoose = require("mongoose");
const logger = require ('../utils/logger');


const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            ssl: true,
            tlsAllowInvalidCertificates: false,
        };
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        logger.info(`MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected successfully.');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err.message}`);
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed due to app termination.');
            process.exit(0);
        });

    } catch (err) {
        logger.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;