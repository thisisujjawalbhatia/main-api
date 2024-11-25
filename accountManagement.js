const fs = require('fs');

// Path to the JSON file
const jsonFilePath = './accounts.json';

// Utility function to load the JSON data
function loadAccounts() {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
}

// Utility function to save the JSON data
function saveAccounts(data) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Assign a user account to a user ID
function assignUserAccount(userId) {
    const data = loadAccounts();

    // Ensure there are available accounts
    if (data.availableAccounts.length === 0) {
        throw new Error("No available accounts to assign.");
    }

    // Take the first available account
    const account = data.availableAccounts.shift();

    // Add the user ID to the account and move it to the userAccounts array
    account.userId = userId;
    data.userAccounts.push(account);

    // Save the updated data
    saveAccounts(data);

    console.log(`Assigned account to user ${userId}:`, account);
}

// Get the credentials for a user ID
function getUserAccount(userId) {
    const data = loadAccounts();

    // Find the account associated with the given user ID
    const account = data.userAccounts.find(acc => acc.userId === userId);

    if (!account) {
        throw new Error(`No account found for user ID ${userId}.`);
    }

    return {
        publicKey: account.public,
        privateKey: account.private,
    };
}

// Assign a toll account
function assignTollAccount(tollId) {
    const data = loadAccounts();

    // Ensure there are available accounts
    if (data.availableAccounts.length === 0) {
        throw new Error("No available accounts to assign.");
    }

    // Take the first available account
    const account = data.availableAccounts.shift();

    // Add the toll ID to the account and move it to the tollAccounts array
    account.tollId = tollId;
    data.tollAccounts.push(account);

    // Save the updated data
    saveAccounts(data);

    console.log(`Assigned account to toll ${tollId}:`, account);
}

// Get the credentials for a toll ID
function getTollAccount(tollId) {
    const data = loadAccounts();

    // Find the account associated with the given toll ID
    const account = data.tollAccounts.find(acc => acc.tollId === tollId);

    if (!account) {
        throw new Error(`No account found for toll ID ${tollId}.`);
    }

    return {
        publicKey: account.public,
        privateKey: account.private,
    };
}
function getMainAccount() {

    // Read the file
    const data = loadAccounts();
    
    // Parse the JSON content
    // console.log(data.mainAccount);
    return {
        publicKey: data.mainAccount.public,
        privateKey: data.mainAccount.private
    };

}

module.exports =  {
    assignUserAccount,
    getUserAccount,
    assignTollAccount,
    getTollAccount,
    getMainAccount
};
// getMainAccount()
// Example Usage
// try {
//     assignUserAccount("1");
//     console.log(getUserAccount("1"));

//     assignTollAccount("2");
//     console.log(getTollAccount("2"));
// } catch (error) {
//     console.error(error.message);
// }

// export default {assignUserAccount,getUserAccount,assignTollAccount,getTollAccount}