namespace XaTanThuanDong.Api.Dtos;

public record LoginRequest(string Email, string Password);

public record AuthResponse(
    string Token,
    string UserId,
    string Email,
    string? FullName,
    string[] Roles
);
