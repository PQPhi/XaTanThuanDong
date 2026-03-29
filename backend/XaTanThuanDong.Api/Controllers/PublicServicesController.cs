using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/public/services")]
public class PublicServicesController : ControllerBase
{
    private readonly AppDbContext _db;

    public PublicServicesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("procedures")]
    public async Task<ActionResult<IEnumerable<ServiceProcedureDto>>> GetProcedures()
    {
        var data = await _db.ServiceProcedures.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new ServiceProcedureDto(
                x.Id, x.Name, x.Description, x.RequiredDocuments, x.ProcessingTime, x.Fee, x.FormTemplateUrl, x.IsActive))
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost("applications")]
    public async Task<ActionResult<object>> CreateApplication([FromBody] CreateApplicationRequest req)
    {
        var procedure = await _db.ServiceProcedures.FirstOrDefaultAsync(x => x.Id == req.ServiceProcedureId && x.IsActive);
        if (procedure is null) return BadRequest(new { message = "Thủ tục không tồn tại." });

        var app = new ServiceApplication
        {
            ServiceProcedureId = req.ServiceProcedureId,
            ApplicantName = req.ApplicantName,
            ApplicantEmail = req.ApplicantEmail,
            ApplicantPhone = req.ApplicantPhone,
            Address = req.Address,
            AttachmentUrl = req.AttachmentUrl,
            Status = "Submitted"
        };

        _db.ServiceApplications.Add(app);
        await _db.SaveChangesAsync();

        return Ok(new { applicationId = app.Id, status = app.Status });
    }

    [HttpGet("applications/{id:int}")]
    public async Task<ActionResult<ApplicationDto>> GetApplicationStatus([FromRoute] int id)
    {
        var a = await _db.ServiceApplications.AsNoTracking()
            .Include(x => x.ServiceProcedure)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (a is null) return NotFound();

        return Ok(new ApplicationDto(
            a.Id,
            a.ServiceProcedureId,
            a.ServiceProcedure.Name,
            a.ApplicantName,
            a.ApplicantEmail,
            a.ApplicantPhone,
            a.Status,
            a.Note,
            a.SubmittedAtUtc));
    }
}
