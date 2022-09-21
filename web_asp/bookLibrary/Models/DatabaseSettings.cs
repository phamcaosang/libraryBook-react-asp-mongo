namespace BookLibrary.Models
{
    public class DatabaseSettings: IDatabaseSettings
    {
        public string BooksCollectionName { get; set; } = String.Empty;

        public string TransactionsCollectionName { get; set; } = String.Empty;
        public string UsersCollectionName { get; set; } = String.Empty;
        public string ConnectionString { get; set; } = String.Empty;
        public string DatabaseName { get; set; } = String.Empty;

        
    }
}
