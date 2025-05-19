"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const api_1 = require("./api");
exports.transactionService = {
    getBalance: async () => {
        try {
            return await api_1.apiService.transactions.getBalance();
        }
        catch (error) {
            console.error('Get balance error:', error);
            throw error;
        }
    },
    getIncomeTransactions: async () => {
        try {
            const transactions = await api_1.apiService.transactions.getIncome();
            return { transactions };
        }
        catch (error) {
            console.error('Get income transactions error:', error);
            throw error;
        }
    },
    getExpenseTransactions: async () => {
        try {
            const transactions = await api_1.apiService.transactions.getExpenses();
            return { transactions };
        }
        catch (error) {
            console.error('Get expense transactions error:', error);
            throw error;
        }
    },
    getRecentTransactions: async () => {
        try {
            const allTransactions = await api_1.apiService.transactions.getAll();
            // Sort by date and get the 5 most recent
            const sortedTransactions = [...allTransactions].sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }).slice(0, 5);
            return { transactions: sortedTransactions };
        }
        catch (error) {
            console.error('Get recent transactions error:', error);
            throw error;
        }
    },
    getTransactionsByMonth: async (month, year) => {
        try {
            const allTransactions = await api_1.apiService.transactions.getAll();
            // Filter by month and year
            const filteredTransactions = allTransactions.filter(tx => {
                const date = new Date(tx.created_at);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
            return { transactions: filteredTransactions };
        }
        catch (error) {
            console.error('Get transactions by month error:', error);
            throw error;
        }
    },
    addTransaction: async (transaction) => {
        try {
            await api_1.apiService.transactions.create(transaction);
            return { success: true };
        }
        catch (error) {
            console.error('Add transaction error:', error);
            throw error;
        }
    }
};
exports.default = exports.transactionService;
//# sourceMappingURL=transactionService.js.map