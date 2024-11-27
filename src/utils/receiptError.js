const handleReceiptError = async (error, createdReceipts = []) => {
    if (createdReceipts.length > 0) {
      try {
        const receiptIds = createdReceipts.map(t => t._id);
        await deleteReceipts(receiptIds);
        console.log('Successfully rolled back receipts');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
        // You might want to send this to an error tracking service
        throw new Error(`
          Critical error: Receipt rollback failed. 
          Original error: ${error.message}
          Rollback error: ${rollbackError.message}
          Affected receipt IDs: ${createdReceipts.map(t => t._id).join(', ')}
        `);
      }
    }
    throw error;
  };