using BookLibrary.Models;
using BookLibrary.Services;
using Microsoft.AspNetCore.Mvc;
using BookLibrary.Authorization;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookLibrary.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService bookService;

        public BooksController(IBookService bookService)
        {
            this.bookService = bookService;
        }
        // GET: api/<BookController>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<Book>> GetAll()
        {
          return bookService.GetAll();
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public ActionResult<Book> GetById(string id)
        {
            try
            {
                var book = bookService.GetById(id);
                if (book == null)
                {
                    return NotFound($"Book with Id = {id} not found");
                }
                return book;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
            
        }

        // GET api/<BookController>/5
        [AllowAnonymous]
        [HttpGet("genre/{genre}")]
        public ActionResult<List<Book>> GetByGenre(string genre)
        {
            var book = bookService.GetByGenre(genre);
            if (book == null)
            {
                return NotFound($"Book with genre = {genre} not found");
            }
            return book;
        }


        [AllowAnonymous]
        [HttpGet("search/{title}")]
        public ActionResult<List<Book>> SearchByTitle(string title)
        {
            var book = bookService.GetByTitle(title);
            return book;
        }

        [AllowAnonymous]
        [HttpGet("title/{title}")]
        public ActionResult<Book> GetByExactTitle(string title)
        {
            var book = bookService.GetByExactTitle(title);
            return book;
        }

        // GET: api/<BookController>
        [AllowAnonymous]
        [HttpGet("popularity")]
        public ActionResult<List<Book>> GetByPopularity()
        {
            return bookService.GetByPopularity();
        }

        // GET: api/<BookController>
        [AllowAnonymous]
        [HttpGet("rating")]
        public ActionResult<List<Book>> GetByRating()
        {
            return bookService.GetByRating();
        }

        // POST api/<BookController>
        [Authorize(Role.Admin)]
        [HttpPost]
        public ActionResult<Book> Post([FromBody] Book book)
        {           
            bookService.Create(book);
            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
        }

        // PUT api/<BookController>/5
        [Authorize(Role.Admin)]
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Book book)
        {
            var existingBook = bookService.GetById(id);
            if (existingBook == null)
            {
                return NotFound($"Book with Id = {id} not found");
            }
            bookService.Update(id, book);
            return NoContent();
        }


        [Authorize(Role.Admin)]
        [HttpGet("stats/numBook")]
        public ActionResult<long> GetNumberOfBooks()
        {
            return bookService.GetNumberBooks();
        }

        // DELETE api/<BookController>/5
        [Authorize(Role.Admin)]
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingBook = bookService.GetById(id);
            if (existingBook == null)
            {
                return NotFound($"Book with Id = {id} not found");
            }
            bookService.Remove(id);
            return Ok($"Book with Id = {id} deleted");
        }
    }
}
