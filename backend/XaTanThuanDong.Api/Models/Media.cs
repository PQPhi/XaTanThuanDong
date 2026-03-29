namespace XaTanThuanDong.Api.Models;

public class Media
{
    public int Id { get; set; }
    public string FileName { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string ContentType { get; set; } = default!;
    public long Size { get; set; }
    public string? Topic { get; set; } // chủ đề gallery

    public string UploadedByUserId { get; set; } = default!;
    public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;

    public AppUser UploadedByUser { get; set; } = default!;
}
