using BookLibrary.Models;
using MongoDB.Driver;
using BookLibrary.Helpers;
using BCrypt;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using BCrypt.Net;
using Microsoft.Extensions.Options;
using BookLibrary.Authorization;

namespace BookLibrary.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMongoCollection<User> _users;
        private IJwtUtils _jwtUtils;

        public AuthService(IDatabaseSettings settings, IMongoClient mongoClient, IJwtUtils jwtUtils)
        {
            _jwtUtils = jwtUtils;
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        private User GetByEmail(string email)
        {
            return _users.Find(user => user.Email == email).FirstOrDefault();
        }


        public User Login(User user)
        {
            User getUser = GetByEmail(user.Email);
            if (user != null)
            {
                if (BCrypt.Net.BCrypt.Verify(user.Password, getUser.Password))
                {
                    return getUser;
                }
                return null;
            }
            else
            {
                return null;
            }
        }

        public Boolean Register(User user)
        {

            if (GetByEmail(user.Email) == null)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                _users.InsertOne(user);
                return true;

            }
            return false;
        }
        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            User user = GetByEmail(model.Email);

            // validate
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                /*throw new AppException("Username or password is incorrect");*/
                return null;
            }

            // authentication successful so generate jwt token
            var jwtToken = _jwtUtils.GenerateJwtToken(user);

            return new AuthenticateResponse(user, jwtToken);
        }



        public User GetById(string id)
        {
            User user = _users.Find(x => x.Id == id).FirstOrDefault(); ;
            if (user == null) throw new KeyNotFoundException("User not found");
            return user;
        }

    }
}
