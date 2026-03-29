namespace XaTanThuanDong.Api.Models;

public class Comment
{
    public int Id { get; set; }
    public int ArticleId { get; set; }

    public string AuthorName { get; set; } = default!;
    public string? AuthorEmail { get; set; }
    public string Content { get; set; } = default!;

    public bool IsApproved { get; set; } = false;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public Article Article { get; set; } = default!;
}
