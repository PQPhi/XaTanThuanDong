namespace XaTanThuanDong.Api.Models;

public class Article
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Title { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string? Summary { get; set; }
    public string ContentHtml { get; set; } = default!;

    public string Status { get; set; } = "Draft"; // Draft | Pending | Published
    public DateTime? PublishedAtUtc { get; set; }

    public string? ThumbnailUrl { get; set; }

    public string CreatedByUserId { get; set; } = default!;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public Category Category { get; set; } = default!;
    public AppUser CreatedByUser { get; set; } = default!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
