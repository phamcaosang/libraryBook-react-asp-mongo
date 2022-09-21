using BookLibrary.Models;


namespace BookLibrary.Services
{
    public interface IAuthService
    {
        Boolean Register(User user);
        User Login(User user);
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        /*IEnumerable<User> GetAll();*/
        User GetById(string id);

    }
}
