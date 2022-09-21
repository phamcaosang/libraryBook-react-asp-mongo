using BookLibrary.Models;
namespace BookLibrary.Services
{
    public interface IUserService
    {
        List<User> GetAll();
        User GetById(string id);
        void UpdateAvatar(string id, string url);
        void UpdateFavorite(string id, User user);

        public User GetByMail(string email);
        User Create(User User);
        void Update(string id, User User);
        void Remove(string id);

        long GetNumUser();
    }
}
