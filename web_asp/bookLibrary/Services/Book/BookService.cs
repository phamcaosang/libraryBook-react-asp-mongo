using BookLibrary.Models;
using MongoDB.Driver;
namespace BookLibrary.Services
{
    public class BookService : IBookService
    {
        private readonly IMongoCollection<Book> _books;

        public BookService(IDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _books = database.GetCollection<Book>(settings.BooksCollectionName);
        }
        public Book Create(Book book)
        {
            _books.InsertOne(book);
            return book;
        }

        public List<Book> GetAll()
        {
            return _books.Find(book => true).SortByDescending(book => book.NumRatings).Limit(500).ToList();

        }

        public Book GetById(string id)
        {
            return _books.Find(book => book.Id == id).FirstOrDefault();
        }

        public List<Book> GetByTitle(string title)
        {
            return _books.Find(book => book.Title.ToLower().Contains(title.ToLower())).Limit(5).ToList();
        }
        public List<Book> GetByGenre(string genre)
        {
            return _books.Find(book => book.Genres.Contains(genre)).SortByDescending(book => book.NumRatings).Limit(10).ToList();
        }

        public Book GetByExactTitle(string title)
        {
            return _books.Find(book => book.Title == title).FirstOrDefault();
        }

        public List<Book> GetByPopularity()
        {
            return _books.Find(book => true).SortByDescending(book => book.NumRatings).Limit(500).ToList();
        }

        public List<Book> GetByRating()
        {
            return _books.Find(book => true).SortByDescending(book => book.Rating).Limit(500).ToList();
        }


        private bool ContainGenres(Book book, List<string> genres)
        {
            for (int i = 0; i < genres.Count; i++)
            {
                if (book.Genres.Contains(genres[i]))
                {
                    return true;
                }
            }
            return false;
        }

        public List<Book> GetByGenres(List<string> genres)
        {
            return _books.Find(book => ContainGenres(book, genres)).SortByDescending(book => book.NumRatings).Limit(10).ToList();
        }

        public void Remove(string id)
        {
            _books.DeleteOne(book => book.Id == id);
        }

        public void Update(string id, Book book)
        {
            _books.FindOneAndReplace(book => book.Id == id, book);
        }

        public long GetNumberBooks()
        {
            return _books.Find(book => true).Count();
        }
    }
}
