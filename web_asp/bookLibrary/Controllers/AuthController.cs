using BookLibrary.Models;
using BookLibrary.Services;
using Microsoft.AspNetCore.Mvc;
/*using Microsoft.AspNetCore.Authorization;*/
using BookLibrary.Authorization;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookLibrary.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly IUserService userService;


        public AuthController(IAuthService authService, IUserService userService)
        {
            this.authService = authService;
            this.userService = userService;

        }

        // POST api/<AuthController>
        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult Register([FromBody] User user)
        {
            if (authService.Register(user))
            {
                return Ok($"You have regsiter successfully");
            }
            return NotFound($"Email had already in use");
        }

        [AllowAnonymous]
        [HttpGet("email/{email}")]
        public ActionResult usableMail(string email)
        {
            if (userService.GetByMail(email) != null)
            {
                return Unauthorized();
            }
            return Ok(true);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult Login(AuthenticateRequest model)
        {
            AuthenticateResponse data = authService.Authenticate(model);
            if (data != null)
            {
                return Ok(data);
            }
            return NotFound($"Wrong email or password");
        }


        [AllowAnonymous]
        [HttpGet("allusers")]
        public ActionResult<List<User>> GetAllUsers()
        {
            return userService.GetAll();
        }

    }
}
