using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace BookLibrary.Models
{
    [BsonIgnoreExtraElements]
    public class Transaction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; } = String.Empty;

        [BsonElement("userId")]
        public String UserId { get; set; } = String.Empty;

        [BsonElement("bookIds")]
        public List<BookCart> BookIds { get; set; } = new List<BookCart>();


        /*        [BsonElement("submitDate")]
                public String SubmitDate { get; set; } = DateTime.Now.ToString("yyyy/MM/dd");

                [BsonElement("expireDate")]
                public String ExpireDate { get; set; } = DateTime.Now.AddDays(14).ToString("yyyy/MM/dd");*/

        [BsonElement("total")]
        public decimal Total { get; set; } = 0;

        [BsonElement("submitDate")]
        public DateTime SubmitDate { get; set; } = DateTime.Now;

        [BsonElement("expireDate")]
        public DateTime ExpireDate { get; set; } = DateTime.Now.AddDays(14);

        [BsonElement("status")]
        public Status Status { get; set; } = Status.Pending;

        [BsonElement("response")]
        public string Response { get; set; } = String.Empty;



    }
}
