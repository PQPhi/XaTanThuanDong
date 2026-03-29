using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public AdminUsersController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public record UserListItem(string Id, string Email, string? FullName, bool IsActive, string[] Roles);
    public record CreateUserRequest(string Email, string Password, string? FullName, bool IsActive, string[] Roles);
    public record UpdateUserRequest(string? FullName, bool IsActive, string[] Roles);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListItem>>> List()
    {
        var users = await _userManager.Users.OrderByDescending(x => x.CreatedAtUtc).ToListAsync();
        var data = new List<UserListItem>();
        foreach (var u in users)
        {
            var roles = (await _userManager.GetRolesAsync(u)).ToArray();
            data.Add(new UserListItem(u.Id, u.Email ?? "", u.FullName, u.IsActive, roles));
        }
        return Ok(data);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateUserRequest req)
    {
        var user = new AppUser
        {
            Email = req.Email,
            UserName = req.Email,
            EmailConfirmed = true,
            FullName = req.FullName,
            IsActive = req.IsActive
        };

        var result = await _userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });

        if (req.Roles?.Length > 0)
            await _userManager.AddToRolesAsync(user, req.Roles);

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update([FromRoute] string id, [FromBody] UpdateUserRequest req)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        user.FullName = req.FullName;
        user.IsActive = req.IsActive;

        var r1 = await _userManager.UpdateAsync(user);
        if (!r1.Succeeded)
            return BadRequest(new { message = string.Join("; ", r1.Errors.Select(e => e.Description)) });

        var current = await _userManager.GetRolesAsync(user);
        var remove = await _userManager.RemoveFromRolesAsync(user, current);
        if (!remove.Succeeded)
            return BadRequest(new { message = string.Join("; ", remove.Errors.Select(e => e.Description)) });

        if (req.Roles?.Length > 0)
        {
            var add = await _userManager.AddToRolesAsync(user, req.Roles);
            if (!add.Succeeded)
                return BadRequest(new { message = string.Join("; ", add.Errors.Select(e => e.Description)) });
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        var res = await _userManager.DeleteAsync(user);
        if (!res.Succeeded)
            return BadRequest(new { message = string.Join("; ", res.Errors.Select(e => e.Description)) });

        return NoContent();
    }
}
