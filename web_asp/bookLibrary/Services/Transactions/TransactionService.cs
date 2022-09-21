using BookLibrary.Models;
using MongoDB.Bson;
using MongoDB.Driver;
namespace BookLibrary.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IMongoCollection<Transaction> _transactions;

        public TransactionService(IDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _transactions = database.GetCollection<Transaction>(settings.TransactionsCollectionName);
        }
        public Transaction CreateTransaction(Transaction transaction)
        {
            _transactions.InsertOne(transaction);
            return transaction;
        }

        public List<Transaction> GetAll()
        {
            return _transactions.Find(item => true).ToList();
        }

        public Transaction GetById(string id)
        {
            return _transactions.Find(tsid =>tsid.Id == id).FirstOrDefault();
        }

        public List<Transaction> GetExpiredTransactions()
        {
            throw new NotImplementedException();
        }

        public List<Transaction> GetTransactionsByUser(string id)
        {
            return _transactions.Find(ts => ts.UserId == id).ToList();
        }

        public void UpdateTransaction(string id, Transaction ts)
        {
            _transactions.FindOneAndReplace(transaction => transaction.Id == id, ts);
        }

   
        public void RefreshTransactions()
        {

            List<Transaction> transactions = GetAll();
            foreach (Transaction t in transactions)
            {
                bool condition = (t.ExpireDate - t.SubmitDate).TotalDays < 0 && t.Status != Status.Done;
                t.Status = Status.Expired;
                _transactions.FindOneAndReplace(transaction =>  transaction.Id == t.Id && condition, t);
            }
            //_transactions.FindOneAndReplace(transaction => ((DateTime.Parse(transaction.ExpireDate) - DateTime.Parse(transaction.SubmitDate)).TotalDays < 0), t);
        }

        public void DeleteTransaction(string id)
        {
            _transactions.DeleteOne(transaction => transaction.Id == id) ;
        }

        public long GetTotalTransaction()
        {
            return _transactions.Find(item => true).Count();
        }
    }
}
