using BookLibrary.Models;
using MongoDB.Driver;
using BookLibrary.Authorization;

namespace BookLibrary.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;
        private IJwtUtils _jwtUtils;

        public UserService(IDatabaseSettings settings, IMongoClient mongoClient, IJwtUtils jwtUtils)
        {
            _jwtUtils = jwtUtils;
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }
        public User Create(User User)
        {
            _users.InsertOne(User);
            return User;
        }

        public List<User> GetAll()
        {
            return _users.Find(user => true).ToList();
        }

        public User GetById(string id)
        {
            return _users.Find(user => user.Id == id).FirstOrDefault();
        }

        public User GetByMail(string email)
        {
            return _users.Find(user => user.Email == email).FirstOrDefault();
        }

        public void Remove(string id)
        {
            _users.DeleteOne(user => user.Id == id);
        }

        public void Update(string id, User user)
        {
            _users.FindOneAndReplace(u => u.Id == id, user);

        }


        public void UpdateAvatar(string id, string url)
        {
            User getUser = _users.Find(u => u.Id == id).FirstOrDefault();
            getUser.Avatar = url;
            _users.FindOneAndReplace(u => u.Id == id, getUser);
        }

        public void UpdateFavorite(string id, User user)
        {
            _users.FindOneAndReplace(u => u.Id == id, user);
        }

        public long GetNumUser()
        {
            return _users.Find(user => true).CountDocuments();
        }
    }
}
