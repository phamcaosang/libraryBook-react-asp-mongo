using BookLibrary.Models;

namespace BookLibrary.Services
{
    public interface IBookService
    {
        List<Book> GetAll();
        Book GetById(string id);
        List<Book> GetByGenre(string genre);
        List<Book> GetByTitle(string title);
        Book GetByExactTitle(string title);
        List<Book> GetByGenres(List<string> genres);
        List<Book> GetByPopularity();
        List<Book> GetByRating();
        Book Create(Book book);
        void Update(string id, Book book);
        void Remove(string id);

        long GetNumberBooks();
    }
}
