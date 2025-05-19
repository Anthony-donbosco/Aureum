export declare const transactionService: {
    getBalance: () => Promise<any>;
    getIncomeTransactions: () => Promise<{
        transactions: any;
    }>;
    getExpenseTransactions: () => Promise<{
        transactions: any;
    }>;
    getRecentTransactions: () => Promise<{
        transactions: any[];
    }>;
    getTransactionsByMonth: (month: any, year: any) => Promise<{
        transactions: any;
    }>;
    addTransaction: (transaction: any) => Promise<{
        success: boolean;
    }>;
};
export default transactionService;
