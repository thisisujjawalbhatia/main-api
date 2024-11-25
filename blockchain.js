const { Web3 } = require('web3');

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "vehicleOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tollBoothOwner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "TollPaid",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "tollBooths",
        "outputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tollAmount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "vehicles",
        "outputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "registerVehicle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_tollAmount",
            "type": "uint256"
          }
        ],
        "name": "registerTollBooth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_vehicleOwner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_tollBoothOwner",
            "type": "address"
          }
        ],
        "name": "payToll",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_tollBoothOwner",
            "type": "address"
          }
        ],
        "name": "checkTollAmount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
];

const CONTRACT_ADDRESS = '0x00B0E216C64AA997EBFB42bEf3822F507945C95A';
const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

// Utility function to validate Ethereum address
function validateEthereumAddress(address) {
    if (!address || typeof address !== 'string') {
        throw new Error('Invalid address: Address must be a non-empty string');
    }
    if (!web3.utils.isAddress(address)) {
        throw new Error(`Invalid Ethereum address: ${address}`);
    }
}

// Comprehensive transaction sender
async function sendTransaction(methodCall, senderAddress, privateKey, value = 0) {
    try {
        // Validate inputs
        validateEthereumAddress(senderAddress);
        if (!privateKey) {
            throw new Error('Private key is required');
        }

        // Prepare transaction
        const data = methodCall.encodeABI();
        const gas = await methodCall.estimateGas({ 
            from: senderAddress, 
            value: value 
        });
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(senderAddress);
        
        const txObject = {
            to: CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
            value
        };

        // Sign and send transaction
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        return receipt;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

// Register Vehicle Function
async function registerVehicle(vehicleOwner, senderAddress, privateKey) {
    try {
        // Validate inputs
        validateEthereumAddress(vehicleOwner);
        validateEthereumAddress(senderAddress);
        
        // Create method call
        const methodCall = contract.methods.registerVehicle(vehicleOwner);
        
        // Send transaction
        const receipt = await sendTransaction(methodCall, senderAddress, privateKey);
        
        console.log('Vehicle Registration Details:');
        console.log('Vehicle Owner:', vehicleOwner);
        console.log('Transaction Hash:', receipt.transactionHash);
        
        // Verify vehicle registration (optional)
        const registeredVehicle = await contract.methods.vehicles(vehicleOwner).call();
        console.log('Registered Vehicle Details:', registeredVehicle);
        
        return receipt;
    } catch (error) {
        console.error('Vehicle Registration Error:', error);
        throw error;
    }
}

// Register Toll Booth Function
async function registerTollBooth(tollBoothOwner, tollAmount, senderAddress, privateKey) {
    try {
        // Validate inputs
        validateEthereumAddress(tollBoothOwner);
        validateEthereumAddress(senderAddress);
        
        // Ensure toll amount is a valid number
        const parsedTollAmount = Number(tollAmount);
        if (isNaN(parsedTollAmount) || parsedTollAmount < 0) {
            throw new Error('Invalid toll amount. Must be a non-negative number.');
        }
        
        // Create method call
        const methodCall = contract.methods.registerTollBooth(tollBoothOwner, parsedTollAmount);
        
        // Send transaction
        const receipt = await sendTransaction(methodCall, senderAddress, privateKey);
        
        console.log('Toll Booth Registration Details:');
        console.log('Toll Booth Owner:', tollBoothOwner);
        console.log('Toll Amount:', parsedTollAmount);
        console.log('Transaction Hash:', receipt.transactionHash);
        
        // Verify toll booth registration
        const registeredTollBooth = await contract.methods.tollBooths(tollBoothOwner).call();
        console.log('Registered Toll Booth Details:', registeredTollBooth);
        
        return receipt;
    } catch (error) {
        console.error('Toll Booth Registration Error:', error);
        throw error;
    }
}

// Pay Toll Function
async function payToll(vehicleOwner, tollBoothOwner, senderAddress, privateKey, tollAmount) {
    try {
        // Validate inputs
        validateEthereumAddress(vehicleOwner);
        validateEthereumAddress(tollBoothOwner);
        validateEthereumAddress(senderAddress);
        
        // Ensure toll amount is a valid number
        const parsedTollAmount = Number(tollAmount);
        if (isNaN(parsedTollAmount) || parsedTollAmount <= 0) {
            throw new Error('Invalid toll amount. Must be a positive number.');
        }
        
        // Convert toll amount to wei
        const valueInWei = web3.utils.toWei(parsedTollAmount.toString(), 'ether');
        
        // Create method call
        const methodCall = contract.methods.payToll(vehicleOwner, tollBoothOwner);
        
        // Get initial balances
        const vehicleInitialBalance = await web3.eth.getBalance(vehicleOwner);
        const tollBoothInitialBalance = await web3.eth.getBalance(tollBoothOwner);
        
        // Send transaction
        const receipt = await sendTransaction(methodCall, senderAddress, privateKey, valueInWei);
        
        // Get final balances
        const vehicleFinalBalance = await web3.eth.getBalance(vehicleOwner);
        const tollBoothFinalBalance = await web3.eth.getBalance(tollBoothOwner);
        
        console.log('Toll Payment Details:');
        console.log('Vehicle Owner:', vehicleOwner);
        console.log('Toll Booth Owner:', tollBoothOwner);
        console.log('Toll Amount:', parsedTollAmount, 'ETH');
        console.log('Transaction Hash:', receipt.transactionHash);
        
        // Calculate and log balance changes
        console.log('Vehicle Balance Change:', 
            web3.utils.fromWei((BigInt(vehicleInitialBalance) - BigInt(vehicleFinalBalance)).toString(), 'ether'),
            'ETH'
        );
        console.log('Toll Booth Balance Change:', 
            web3.utils.fromWei((BigInt(tollBoothFinalBalance) - BigInt(tollBoothInitialBalance)).toString(), 'ether'),
            'ETH'
        );
        
        return receipt;
    } catch (error) {
        console.error('Toll Payment Error:', error);
        throw error;
    }
}

// Check Toll Amount Function
async function checkTollAmount(tollBoothOwner) {
    try {
        // Validate input
        validateEthereumAddress(tollBoothOwner);
        
        // Fetch toll amount
        const tollAmount = await contract.methods.checkTollAmount(tollBoothOwner).call();
        
        console.log('Toll Amount Details:');
        console.log('Toll Booth Owner:', tollBoothOwner);
        console.log('Current Toll Amount:', tollAmount);
        
        return tollAmount;
    } catch (error) {
        console.error('Check Toll Amount Error:', error);
        throw error;
    }
}

// Comprehensive Test Function
// async function runFullTest() {
//     try {
//         console.log('===== FULL BLOCKCHAIN API TEST =====');
        
//         // Test addresses and keys (replace with your actual test addresses)
//         const vehicleOwner = "0x6ECFF40f6Cb22f1533c0aa4150a5D772266e4D8D";
//         const vehiclePrivateKey = "0xb8b9e83dc9da8c91db469895f4ff67a60d51459907f1897d3e577b8c0a3d7fd9";
        
//         const tollBoothOwner = "0xc4045F2F68F7A9c9b42DDfd089D22A67EEA5DA0d";
//         const tollBoothPrivateKey = "0x52583753ca0377b0206e60df10880c549e50a362803b14d97fe995cb6fab5ded";
        
//         // 1. Register Vehicle
//         console.log('\n--- Registering Vehicle ---');
//         await registerVehicle(vehicleOwner, vehicleOwner, vehiclePrivateKey);
        
//         // 2. Register Toll Booth
//         console.log('\n--- Registering Toll Booth ---');
//         await registerTollBooth(tollBoothOwner, 2, tollBoothOwner, tollBoothPrivateKey);
        
//         // 3. Check Toll Amount
//         console.log('\n--- Checking Toll Amount ---');
//         const tollAmount = await checkTollAmount(tollBoothOwner);
        
//         // 4. Pay Toll
//         console.log('\n--- Paying Toll ---');
//         await payToll(
//             vehicleOwner, 
//             tollBoothOwner, 
//             vehicleOwner,
//             vehiclePrivateKey, 
//             tollAmount
//         );
        
//         console.log('\n===== TEST COMPLETED SUCCESSFULLY =====');
//     } catch (error) {
//         console.error('Full Test Failed:', error);
//     }
// }

// Export functions
module.exports = {
    registerVehicle,
    registerTollBooth,
    payToll,
    checkTollAmount,
};
// let amt = checkTollAmount("0xc4045F2F68F7A9c9b42DDfd089D22A67EEA5DA0d")
// console.log(amt);
// Uncomment to run test immediately
//  runFullTest();