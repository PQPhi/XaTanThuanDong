using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XaTanThuanDong.Api.Services;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin,Editor,Viewer")]
public class AdminDashboardController : ControllerBase
{
    private readonly IDashboardService _dashboard;

    public AdminDashboardController(IDashboardService dashboard)
    {
        _dashboard = dashboard;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> Summary()
    {
        var data = await _dashboard.GetAdminSummaryAsync();
        return Ok(data);
    }
}
