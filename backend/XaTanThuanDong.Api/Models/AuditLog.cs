namespace XaTanThuanDong.Api.Models;

public class AuditLog
{
    public long Id { get; set; }
    public string UserId { get; set; } = default!;
    public string Action { get; set; } = default!;
    public string? EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
