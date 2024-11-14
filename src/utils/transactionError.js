const handleTransactionError = async (error, createdTransactions = []) => {
    if (createdTransactions.length > 0) {
      try {
        const transactionIds = createdTransactions.map(t => t._id);
        await deleteReceipts(transactionIds);
        console.log('Successfully rolled back transactions');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
        // You might want to send this to an error tracking service
        throw new Error(`
          Critical error: Transaction rollback failed. 
          Original error: ${error.message}
          Rollback error: ${rollbackError.message}
          Affected transaction IDs: ${createdTransactions.map(t => t._id).join(', ')}
        `);
      }
    }
    throw error;
  };