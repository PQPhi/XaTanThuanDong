namespace XaTanThuanDong.Api.Models;

public class Leader
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;
    public string Title { get; set; } = default!;

    public string GroupKey { get; set; } = "lanh-dao"; // ví dụ: lanh-dao | can-bo | doan-the

    public string? PhotoUrl { get; set; }

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
