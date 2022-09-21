using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace BookLibrary.Models
{
    [BsonIgnoreExtraElements]
    public class Book
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; } = String.Empty;

        [BsonElement("title")]
        public String Title { get; set; } = String.Empty;

        [BsonElement("series")]
        public String Series { get; set; } = String.Empty;

        [BsonElement("author")]
        public String Author { get; set; } = String.Empty;

        [BsonElement("rating")]
        public decimal Rating { get; set; } = 0;

        [BsonElement("description")]
        public String Description { get; set; } = String.Empty;

        [BsonElement("language")]
        public String Language { get; set; } = String.Empty;

        [BsonElement("coverImg")]
        public String CoverImg { get; set; } = String.Empty;

        [BsonElement("genres")]
        public List<String> Genres { get; set; } = new List<string>();

        //[BsonElement("characters")]
        //public List<String> Characters { get; set; } = new List<string>();
        //[BsonElement("awards")]
        //public List<String> Awards { get; set; } = new List<string>();

        [BsonElement("bookFormat")]
        public String BookFormat { get; set; } = String.Empty;

        [BsonElement("pages")]
        public String Pages { get; set; } = String.Empty;

        [BsonElement("publisher")]
        public String Publisher { get; set; } = String.Empty;

        [BsonElement("publishDate")]
        public String PublishDate { get; set; } = String.Empty;

        [BsonElement("numRatings")]
        public int NumRatings { get; set; } = 0;

        [BsonElement("likedPercent")]
        public decimal LikedPercent { get; set; } = 0;

        [BsonElement("price")]
        public decimal Price { get; set; } = 0;

        [BsonElement("status")]
        public StatusBook Status { get; set; } = StatusBook.Available;

        [BsonElement("recommendations")]
        public List<string> Recommendations { get; set; } = new List<string>();

    }
}
