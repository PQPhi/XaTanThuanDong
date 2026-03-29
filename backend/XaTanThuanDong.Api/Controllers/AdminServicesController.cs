using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/admin/services")]
[Authorize(Roles = "Admin,Editor")]
public class AdminServicesController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminServicesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("procedures")]
    public async Task<ActionResult<IEnumerable<ServiceProcedureDto>>> ListProcedures()
    {
        var data = await _db.ServiceProcedures.AsNoTracking()
            .OrderByDescending(x => x.Id)
            .Select(x => new ServiceProcedureDto(
                x.Id, x.Name, x.Description, x.RequiredDocuments, x.ProcessingTime, x.Fee, x.FormTemplateUrl, x.IsActive))
            .ToListAsync();
        return Ok(data);
    }

    [HttpPost("procedures")]
    public async Task<ActionResult<ServiceProcedureDto>> CreateProcedure([FromBody] UpsertServiceProcedureRequest req)
    {
        var e = new ServiceProcedure
        {
            Name = req.Name,
            Description = req.Description,
            RequiredDocuments = req.RequiredDocuments,
            ProcessingTime = req.ProcessingTime,
            Fee = req.Fee,
            FormTemplateUrl = req.FormTemplateUrl,
            IsActive = req.IsActive
        };
        _db.ServiceProcedures.Add(e);
        await _db.SaveChangesAsync();
        return Ok(new ServiceProcedureDto(e.Id, e.Name, e.Description, e.RequiredDocuments, e.ProcessingTime, e.Fee, e.FormTemplateUrl, e.IsActive));
    }

    [HttpPut("procedures/{id:int}")]
    public async Task<ActionResult> UpdateProcedure([FromRoute] int id, [FromBody] UpsertServiceProcedureRequest req)
    {
        var e = await _db.ServiceProcedures.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        e.Name = req.Name;
        e.Description = req.Description;
        e.RequiredDocuments = req.RequiredDocuments;
        e.ProcessingTime = req.ProcessingTime;
        e.Fee = req.Fee;
        e.FormTemplateUrl = req.FormTemplateUrl;
        e.IsActive = req.IsActive;
        e.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("procedures/{id:int}")]
    public async Task<ActionResult> DeleteProcedure([FromRoute] int id)
    {
        var e = await _db.ServiceProcedures.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();
        _db.ServiceProcedures.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Applications
    [HttpGet("applications")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> ListApplications([FromQuery] string? status)
    {
        var q = _db.ServiceApplications.AsNoTracking().Include(x => x.ServiceProcedure).AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) q = q.Where(x => x.Status == status);

        var data = await q
            .OrderByDescending(x => x.SubmittedAtUtc)
            .Select(x => new ApplicationDto(
                x.Id,
                x.ServiceProcedureId,
                x.ServiceProcedure.Name,
                x.ApplicantName,
                x.ApplicantEmail,
                x.ApplicantPhone,
                x.Status,
                x.Note,
                x.SubmittedAtUtc))
            .ToListAsync();

        return Ok(data);
    }

    [HttpPut("applications/{id:int}/status")]
    public async Task<ActionResult> UpdateApplicationStatus([FromRoute] int id, [FromBody] UpdateApplicationStatusRequest req)
    {
        var a = await _db.ServiceApplications.FirstOrDefaultAsync(x => x.Id == id);
        if (a is null) return NotFound();

        a.Status = req.Status;
        a.Note = req.Note;
        a.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
