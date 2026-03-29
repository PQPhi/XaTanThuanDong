using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
}
