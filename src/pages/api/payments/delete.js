// pages/api/transactions/delete.js
export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      try {
        const { transactionIds } = req.body;
        
        if (!Array.isArray(transactionIds)) {
          return res.status(400).json({ 
            success: false, 
            error: 'transactionIds must be an array' 
          });
        }
  
        // Delete all specified transactions
        const result = await Transaction.deleteMany({
          _id: { $in: transactionIds }
        });
  
        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'No transactions found to delete'
          });
        }
  
        res.status(200).json({ 
          success: true, 
          deletedCount: result.deletedCount 
        });
      } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }