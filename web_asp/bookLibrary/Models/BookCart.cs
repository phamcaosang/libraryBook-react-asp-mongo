namespace BookLibrary.Models
{
    public class BookCart
    {
        public String BookId { get; set; } = String.Empty;
        public Status Status { get; set; } = Status.Pending;

    }
}
