const express = require('express');
const bodyParser = require('body-parser');
const {Web3} = require('web3');

const {
    assignUserAccount,
    getUserAccount,
    assignTollAccount,
    getTollAccount,
    getMainAccount
} = require('./accountManagement'); // Import the account functions

const {
    registerVehicle,
    registerTollBooth,
    payToll,
    checkTollAmount,
} = require('./blockchain');

const app = express();
const PORT = 3000;

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes

// Assign a user account
app.post('/assignUserAccount', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        assignUserAccount(userId);
        res.status(200).json({ message: `Account assigned to user ${userId}` });
        let userAccount = getUserAccount(userId);
        registerVehicle(userAccount.publicKey,userAccount.publicKey,userAccount.privateKey)
        res.status(200).json({ message: `Account assigned to user ${userId}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign a toll account
app.post('/assignTollAccount', (req, res) => {
    const { tollId, amount } = req.body;
    if (!tollId) {
        return res.status(400).json({ error: "Toll ID is required" });
    }

    try {
        assignTollAccount(tollId);
        res.status(200).json({ message: `Account assigned to toll ${tollId}` });
        let tollAccount = getTollAccount(tollId);
        registerTollBooth(tollAccount.publicKey,amount/100,tollAccount.publicKey,tollAccount.privateKey);
        res.status(200).json({ message: `Account assigned to toll booth ${tollId}` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addFunds', async (req, res) => {
    const { userId, amount} = req.body;
    let fromAddress = getMainAccount().privateKey;
    let toAddress = getUserAccount(userId).publicKey;
    // const { fromAddress, toAddress, amount } = req.body;
    // console.log(fromAddress, toAddress, amount);


    const fromAccount = web3.eth.accounts.privateKeyToAccount(fromAddress); // Replace with a funded Ganache account private key
    const value = web3.utils.toWei(amount/100, 'ether'); // Convert ETH to Wei

    const tx = {
      from: fromAccount.address,
      to: toAddress,
      value,
      gas: 21000,
      gasPrice: web3.utils.toWei('20', 'gwei'),
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, fromAccount.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    res.status(200).json({ message: 'Funds added successfully' });

});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
