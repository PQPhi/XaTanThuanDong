namespace XaTanThuanDong.Api.Models;

public class ServiceProcedure
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? RequiredDocuments { get; set; }
    public string? ProcessingTime { get; set; }
    public string? Fee { get; set; }
    public string? FormTemplateUrl { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<ServiceApplication> Applications { get; set; } = new List<ServiceApplication>();
}
