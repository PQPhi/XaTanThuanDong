using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;
using XaTanThuanDong.Api.Services;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, ITokenService tokenService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email);
        if (user is null || !user.IsActive)
            return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng." });

        var result = await _signInManager.CheckPasswordSignInAsync(user, req.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng." });

        var token = await _tokenService.CreateTokenAsync(user);
        var roles = (await _userManager.GetRolesAsync(user)).ToArray();

        return Ok(new AuthResponse(token, user.Id, user.Email ?? req.Email, user.FullName, roles));
    }
}
