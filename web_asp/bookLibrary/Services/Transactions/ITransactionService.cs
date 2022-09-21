using BookLibrary.Models;

namespace BookLibrary.Services
{
    public interface ITransactionService
    {
        Transaction CreateTransaction(Transaction transaction);
        List<Transaction> GetAll();
        Transaction GetById(string id);

        List<Transaction> GetTransactionsByUser(string id);
        List<Transaction> GetExpiredTransactions();
        void UpdateTransaction(string id, Transaction ts);

        void RefreshTransactions();

        void DeleteTransaction(string id);

        long GetTotalTransaction();

    }
}
