using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;

namespace XaTanThuanDong.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<object> GetAdminSummaryAsync()
    {
        var articles = await _db.Articles.CountAsync();
        var published = await _db.Articles.CountAsync(x => x.Status == "Published");
        var commentsPending = await _db.Comments.CountAsync(x => !x.IsApproved);
        var procedures = await _db.ServiceProcedures.CountAsync();
        var applications = await _db.ServiceApplications.CountAsync();

        return new
        {
            articles,
            published,
            commentsPending,
            procedures,
            applications
        };
    }
}
