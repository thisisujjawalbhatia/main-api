const express = require('express');
const bodyParser = require('body-parser');
const { 
    registerVehicle, 
    registerTollBooth, 
    payToll, 
    checkTollAmount 
} = require('./blockchain'); // Assuming the provided code is in blockchain.js

const app = express();
app.use(bodyParser.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

// Request validation middleware
const validateRequest = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        next();
    };
};

// Register Vehicle endpoint
app.post('/api/vehicle/register', 
    validateRequest(['vehicleOwner', 'senderAddress', 'privateKey']),
    async (req, res, next) => {
        try {
            const { vehicleOwner, senderAddress, privateKey } = req.body;
            
            const receipt = await registerVehicle(
                vehicleOwner,
                senderAddress,
                privateKey
            );

            res.json({
                success: true,
                data: {
                    transactionHash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber,
                    vehicleOwner
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// Register Toll Booth endpoint
app.post('/api/tollbooth/register',
    validateRequest(['tollBoothOwner', 'tollAmount', 'senderAddress', 'privateKey']),
    async (req, res, next) => {
        try {
            const { tollBoothOwner, tollAmount, senderAddress, privateKey } = req.body;
            
            const receipt = await registerTollBooth(
                tollBoothOwner,
                tollAmount,
                senderAddress,
                privateKey
            );

            res.json({
                success: true,
                data: {
                    transactionHash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber,
                    tollBoothOwner,
                    tollAmount
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// Pay Toll endpoint
app.post('/api/toll/pay',
    validateRequest(['vehicleOwner', 'tollBoothOwner', 'senderAddress', 'privateKey', 'tollAmount']),
    async (req, res, next) => {
        try {
            const { vehicleOwner, tollBoothOwner, senderAddress, privateKey, tollAmount } = req.body;
            
            const receipt = await payToll(
                vehicleOwner,
                tollBoothOwner,
                senderAddress,
                privateKey,
                tollAmount
            );

            res.json({
                success: true,
                data: {
                    transactionHash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber,
                    vehicleOwner,
                    tollBoothOwner,
                    tollAmount
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// Check Toll Amount endpoint
app.get('/api/toll/amount/:tollBoothOwner',
    async (req, res, next) => {
        try {
            const { tollBoothOwner } = req.params;
            
            const tollAmount = await checkTollAmount(tollBoothOwner);

            res.json({
                success: true,
                data: {
                    tollBoothOwner,
                    tollAmount
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// Apply error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Toll System API running on port ${PORT}`);
});

module.exports = app;