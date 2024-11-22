
const {Web3} = require('web3');
const abi =  [
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
  ]
const CONTRACT_ADDRESS = '0xAF9444d1E76EDeA8e0aeE211c34e876F70829634';

const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your RPC URL

const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

async function registerVehicle(vehicleOwner, senderAddress, privateKey) {
    const tx = contract.methods.registerVehicle(vehicleOwner);
    const gas = tx.estimateGas({ from: privateKey, value: 0});
    const receipt = await tx.send({ from: privateKey, gas });
    console.log('Transaction receipt:', receipt);
}

async function registerTollBooth(tollBoothOwner, tollAmount, senderAddress, privateKey) {
    const tx = await contract.methods.registerTollBooth(tollBoothOwner, tollAmount);
    const gas = await tx.estimateGas({ from: privateKey, value: 0});
    const receipt = await tx.send({ from: privateKey, gas });
    console.log('Transaction receipt:', receipt);
}

async function payToll(vehicleOwner, tollBoothOwner, senderAddress, privateKey, tollAmount) {
    const tx = await contract.methods.payToll(vehicleOwner, tollBoothOwner);
    const gas = await tx.estimateGas({ from: privateKey, value: web3.utils.toWei(tollAmount.toString(), 'ether')});
    const receipt = await tx.send({ from: privateKey, gas });
    console.log('Transaction receipt:', receipt);
    // return sendTransaction(tx, senderAddress, privateKey);
}

async function checkTollAmount(tollBoothOwner) {
    return await contract.methods.checkTollAmount(tollBoothOwner).call();
}

async function sendTransaction(tx, senderAddress, privateKey) {
    const txData = {
        to: tx._parent._address,
        data: tx.encodeABI(),
        gas: await tx.estimateGas({ from: senderAddress }),
    };

    const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = {
    registerVehicle,
    registerTollBooth,
    payToll,
    checkTollAmount,
};
// registered id 1 as vehicle
const testVehicleRegistration = async() =>{
    let x = registerVehicle("0x6ECFF40f6Cb22f1533c0aa4150a5D772266e4D8D","0x6ECFF40f6Cb22f1533c0aa4150a5D772266e4D8D","0xb8b9e83dc9da8c91db469895f4ff67a60d51459907f1897d3e577b8c0a3d7fd9")
    console.log(x);
}
testVehicleRegistration();

// registered id 2 as toll booth
// const testTollBoothRegistration = async() =>{
//     let x = registerTollBooth("0xc4045F2F68F7A9c9b42DDfd089D22A67EEA5DA0d",2,"0xc4045F2F68F7A9c9b42DDfd089D22A67EEA5DA0d","0x52583753ca0377b0206e60df10880c549e50a362803b14d97fe995cb6fab5ded")
//     console.log(x);
// }
// testTollBoothRegistration();

// pay toll
// const testPayToll = async() =>{
//     let x = payToll("0x6ECFF40f6Cb22f1533c0aa4150a5D772266e4D8D","0xc4045F2F68F7A9c9b42DDfd089D22A67EEA5DA0d","0x6ECFF40f6Cb22f1533c0aa4150a5D772266e4D8D","0xb8b9e83dc9da8c91db469895f4ff67a60d51459907f1897d3e577b8c0a3d7fd9",2)
//     console.log(x);
// }
// testPayToll();