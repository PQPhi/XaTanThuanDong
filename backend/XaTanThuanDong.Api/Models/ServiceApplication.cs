namespace XaTanThuanDong.Api.Models;

public class ServiceApplication
{
    public int Id { get; set; }
    public int ServiceProcedureId { get; set; }

    public string ApplicantName { get; set; } = default!;
    public string? ApplicantEmail { get; set; }
    public string? ApplicantPhone { get; set; }
    public string? Address { get; set; }

    public string Status { get; set; } = "Submitted"; // Submitted | InProgress | Approved | Rejected
    public string? Note { get; set; }

    public string? AttachmentUrl { get; set; }

    public DateTime SubmittedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public ServiceProcedure ServiceProcedure { get; set; } = default!;
}
