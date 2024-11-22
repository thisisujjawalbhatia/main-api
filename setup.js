const {Web3} = require('web3');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

async function fetchAndStoreAccounts() {
    try {
        // Get accounts from Ganache
        const accounts = await web3.eth.getAccounts();

        // Prepare data structure to store account details
        const accountDetails = accounts.map((address, index) => {
            const privateKey = web3.eth.accounts.wallet[index]?.privateKey;
            return { address, privateKey };
        });

        // Save data to a JSON file
        const filePath = './accounts.json';
        fs.writeFileSync(filePath, JSON.stringify(accountDetails, null, 2));

        console.log(`Accounts have been saved to ${filePath}`);
    } catch (error) {
        console.error('Error fetching or saving accounts:', error);
    }
}

fetchAndStoreAccounts();
