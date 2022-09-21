namespace BookLibrary.Models
{
    public interface IDatabaseSettings
    {
        string BooksCollectionName { get; set; }
        string UsersCollectionName { get; set; }

        string TransactionsCollectionName { get; set; }


        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }

}
