using Microsoft.AspNetCore.Identity;

namespace XaTanThuanDong.Api.Models;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
