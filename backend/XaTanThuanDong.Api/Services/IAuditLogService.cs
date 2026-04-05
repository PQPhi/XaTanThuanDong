namespace XaTanThuanDong.Api.Services;

public interface IAuditLogService
{
    Task WriteAsync(string action, string? entityName = null, string? entityId = null);
}
