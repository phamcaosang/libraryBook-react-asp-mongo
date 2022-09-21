namespace BookLibrary.Models
{
    public class AuthenticateResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }

        public List<String> Favorites { get; set; }
        public Role Role { get; set; }
        public string Token { get; set; }
        public string Avatar { get; set; }

        public AuthenticateResponse(User user, string token)
        {
            Id = user.Id;
            Email = user.Email;
            Username = user.Username;
            Favorites = user.Favorites;
            Avatar = user.Avatar;
            Role = user.Role;
            Token = token;
        }
    }
}


