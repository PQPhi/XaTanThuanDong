using System.Net;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace XaTanThuanDong.Api.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, IWebHostEnvironment env)
    {
        _next = next;
        _env = env;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var traceId = context.TraceIdentifier;

            var (statusCode, title) = ex switch
            {
                ArgumentException => ((int)HttpStatusCode.BadRequest, "Yêu cầu không hợp lệ."),
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "Không có quyền truy cập."),
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, "Không tìm thấy tài nguyên."),
                _ => ((int)HttpStatusCode.InternalServerError, "Đã xảy ra lỗi hệ thống.")
            };

            Log.Error(ex, "Unhandled exception. TraceId={TraceId}", traceId);

            if (!context.Response.HasStarted)
            {
                context.Response.Clear();
                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/problem+json";
            }

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Type = "https://httpstatuses.com/" + statusCode,
                Instance = context.Request.Path,
                Detail = _env.IsDevelopment() ? ex.Message : null
            };

            problem.Extensions["traceId"] = traceId;

            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}
