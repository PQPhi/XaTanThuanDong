using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Services;

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _http;

    public AuditLogService(AppDbContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    public async Task WriteAsync(string action, string? entityName = null, string? entityId = null)
    {
        var ctx = _http.HttpContext;
        var userId = ctx?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous";
        var ip = ctx?.Connection?.RemoteIpAddress?.ToString();

        _db.AuditLogs.Add(new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            IpAddress = ip
        });

        await _db.SaveChangesAsync();
    }
}
