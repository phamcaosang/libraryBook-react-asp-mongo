using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace BookLibrary.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String? Id { get; set; } = String.Empty;

        [BsonElement("email")]
        public String? Email { get; set; } = String.Empty;

        [BsonElement("username")]
        public String? Username { get; set; } = String.Empty;

        [BsonElement("fullname")]
        public String? Fullname { get; set; } = String.Empty;

        [BsonElement("password")]
        public String? Password { get; set; } = String.Empty;

        [BsonElement("avatar")]
        public String? Avatar { get; set; } = String.Empty;

        [BsonElement("role")]
        public Role Role { get; set; } = Role.User;

        [BsonElement("phone")]
        public String? Phone { get; set; } = String.Empty;

        [BsonElement("address")]
        public String? Address { get; set; } = String.Empty;

        [BsonElement("favorites")]
        public List<String>? Favorites { get; set; } = new List<string>();


    }
}
