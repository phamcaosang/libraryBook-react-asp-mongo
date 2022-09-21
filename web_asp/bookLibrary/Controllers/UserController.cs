using Microsoft.AspNetCore.Mvc;
using BookLibrary.Services;
using BookLibrary.Models;
using BookLibrary.Authorization;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookLibrary.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IAuthService authService;
        private readonly IBookService bookService;



        public UserController(IUserService userService, IAuthService authService, IBookService bookService)
        {
            this.userService = userService;
            this.authService = authService;
            this.bookService = bookService;

        }


        [Authorize(Role.Admin)]
        [HttpGet("stats/totalUSers")]
        public ActionResult<long> GetUserNum()
        {
            return userService.GetNumUser();
        }

        [Authorize(Role.Admin)]
        // GET api/<UserController>/5
        [HttpGet]
        public ActionResult<List<User>> GetAll()
        {
            var users = userService.GetAll();
            if (users == null)
            {
                return NotFound($"Cant' find any user");
            }
            return users;
        }


        [Authorize(Role.Admin, Role.User)]
        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public ActionResult<User> Get(string id)
        {
            var user = userService.GetById(id);
            if (user == null)
            {
                return NotFound($"userService with Id = {id} not found");
            }
            return user;
        }

        [Authorize(Role.Admin)]
        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User user)
        {
            User byMail = userService.GetByMail(user.Email);
            if (byMail == null)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                User newUser = userService.Create(user);
                return newUser;
            }
            return Unauthorized("Email already exist");
        }



        [Authorize(Role.Admin, Role.User)]
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] User user)
        {
            User existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            userService.Update(id, user);
            return NoContent();
        }

        [Authorize(Role.Admin, Role.User)]
        [HttpPut("avatar/{id}")]
        public ActionResult UpdateAvatar(string id, [FromBody] User user)
        {
            User existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            userService.UpdateAvatar(id, user.Avatar);
            return Ok();
        }


        [Authorize(Role.Admin, Role.User)]
        [HttpPost("favorites/add/{id}")]
        public ActionResult addFavoriteBook(string id, [FromBody] Book book)
        {

            User existingUser = userService.GetById(id);
            if (existingUser.Favorites.Contains(book.Id))
            {
                return NoContent();
            }
            existingUser.Favorites.Add(book.Id);
            userService.UpdateFavorite(id, existingUser);
            return Ok();
        }

        [Authorize(Role.Admin, Role.User)]
        [HttpPost("favorites/delete/{id}")]
        public ActionResult removeFavoriteBook(string id, [FromBody] Book book)
        {
            User existingUser = userService.GetById(id);
            if (existingUser.Favorites.Contains(book.Id))
            {
                existingUser.Favorites = existingUser.Favorites.Where(item => item != book.Id).ToList();
                userService.UpdateFavorite(id, existingUser);
                return Ok();
            }
            return NoContent();
        }

        [Authorize(Role.Admin, Role.User)]
        [HttpGet("favorites/get/{id}")]
        public ActionResult<List<Book>> getFavoriteBook(string id)
        {
            User existingUser = userService.GetById(id);
            if (existingUser.Favorites.Count > 0)
            {
                /*existingUser.Favorites = existingUser.Favorites.Where(book => book != bookId).ToList();
                userService.UpdateFavorite(id, existingUser);
                return Ok();*/
                List<Book> list = new List<Book>();
                foreach (string bookId in existingUser.Favorites)
                {
                    Book book = bookService.GetById(bookId);
                    if (book != null)
                    {
                        list.Add(book);
                    }
                }
                return list;
            }
            return NoContent();
        }




        // DELETE api/<UserController>/5
        [Authorize(Role.Admin)]
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var existingUser = userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id = {id} not found");
            }
            userService.Remove(id);
            return Ok($"User with Id = {id} deleted");
        }

    }
}

