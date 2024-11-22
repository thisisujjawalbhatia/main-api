const fs = require('fs');

// Load the JSON file
const filePath = './accounts.json';
let accountsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

function assignAccountToUser(userId) {
    // Check if there are available accounts
    if (accountsData.availableAccounts.length === 0) {
        console.log("No available accounts to assign.");
        return;
    }

    // Assign the first available account
    const assignedAccount = accountsData.availableAccounts.shift(); // Remove from availableAccounts
    accountsData.assignedAccounts.push({
        userid: userId,
        public: assignedAccount.public,
        private: assignedAccount.private,
    });

    // Save the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(accountsData, null, 2));

    console.log(`Assigned account to user ${userId}:`, assignedAccount);
}

function unassignAccountFromUser(userId) {
    // Find the account assigned to the user
    const accountIndex = accountsData.assignedAccounts.findIndex(
        (account) => account.userid === userId
    );

    if (accountIndex === -1) {
        console.log(`No account found assigned to user ${userId}.`);
        return;
    }

    // Remove the account from assignedAccounts
    const unassignedAccount = accountsData.assignedAccounts.splice(accountIndex, 1)[0];

    // Add the account back to availableAccounts
    accountsData.availableAccounts.push({
        public: unassignedAccount.public,
        private: unassignedAccount.private,
    });

    // Save the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(accountsData, null, 2));

    console.log(`Unassigned account from user ${userId} and added it back to available accounts:`, unassignedAccount);
}

// Example usage
// assignAccountToUser('user123');
unassignAccountFromUser('user123')
