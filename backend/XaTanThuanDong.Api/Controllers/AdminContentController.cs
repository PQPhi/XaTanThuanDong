using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

public sealed class UploadMediaRequest
{
    public IFormFile File { get; set; } = default!;
    public string? Topic { get; set; }
    public string? Title { get; set; }
}

public sealed class UpdateMediaRequest
{
    public string? Topic { get; set; }
    public string? Title { get; set; }
}

public sealed class ReplaceMediaRequest
{
    public IFormFile File { get; set; } = default!;
    public string? Topic { get; set; }
    public string? Title { get; set; }
}

[ApiController]
[Route("api/admin/content")]
[Authorize(Roles = "Admin,Editor")]
public class AdminContentController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userManager;

    public AdminContentController(AppDbContext db, UserManager<AppUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // Categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> ListCategories()
    {
        var data = await _db.Categories.AsNoTracking()
            .OrderByDescending(x => x.Id)
            .Select(x => new CategoryDto(x.Id, x.Name, x.Slug, x.Description, x.IsActive))
            .ToListAsync();
        return Ok(data);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] UpsertCategoryRequest req)
    {
        var e = new Category
        {
            Name = req.Name,
            Slug = req.Slug,
            Description = req.Description,
            IsActive = req.IsActive
        };
        _db.Categories.Add(e);
        await _db.SaveChangesAsync();
        return Ok(new CategoryDto(e.Id, e.Name, e.Slug, e.Description, e.IsActive));
    }

    [HttpPut("categories/{id:int}")]
    public async Task<ActionResult> UpdateCategory([FromRoute] int id, [FromBody] UpsertCategoryRequest req)
    {
        var e = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        e.Name = req.Name;
        e.Slug = req.Slug;
        e.Description = req.Description;
        e.IsActive = req.IsActive;
        e.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<ActionResult> DeleteCategory([FromRoute] int id)
    {
        var e = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();
        _db.Categories.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Articles
    [HttpGet("articles")]
    public async Task<ActionResult<IEnumerable<ArticleListItemDto>>> ListArticles()
    {
        var data = await _db.Articles.AsNoTracking()
            .Include(x => x.Category)
            .OrderByDescending(x => x.Id)
            .Select(x => new ArticleListItemDto(
                x.Id,
                x.CategoryId,
                x.Category.Name,
                x.Title,
                x.Slug,
                x.Summary,
                x.Status,
                x.PublishedAtUtc,
                x.ThumbnailUrl))
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("articles/{id:int}")]
    public async Task<ActionResult<ArticleDetailDto>> GetArticle([FromRoute] int id)
    {
        var a = await _db.Articles.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (a is null) return NotFound();

        return Ok(new ArticleDetailDto(
            a.Id,
            a.CategoryId,
            a.Title,
            a.Slug,
            a.Summary,
            a.ContentHtml,
            a.Status,
            a.PublishedAtUtc,
            a.ThumbnailUrl));
    }

    [HttpPost("articles")]
    public async Task<ActionResult<ArticleDetailDto>> CreateArticle([FromBody] UpsertArticleRequest req)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var e = new Article
        {
            CategoryId = req.CategoryId,
            Title = req.Title,
            Slug = req.Slug,
            Summary = req.Summary,
            ContentHtml = req.ContentHtml,
            Status = req.Status,
            ThumbnailUrl = req.ThumbnailUrl,
            CreatedByUserId = user.Id,
            PublishedAtUtc = req.Status == "Published" ? DateTime.UtcNow : null
        };

        _db.Articles.Add(e);
        await _db.SaveChangesAsync();

        return Ok(new ArticleDetailDto(e.Id, e.CategoryId, e.Title, e.Slug, e.Summary, e.ContentHtml, e.Status, e.PublishedAtUtc, e.ThumbnailUrl));
    }

    [HttpPut("articles/{id:int}")]
    public async Task<ActionResult> UpdateArticle([FromRoute] int id, [FromBody] UpsertArticleRequest req)
    {
        var e = await _db.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        e.CategoryId = req.CategoryId;
        e.Title = req.Title;
        e.Slug = req.Slug;
        e.Summary = req.Summary;
        e.ContentHtml = req.ContentHtml;
        e.ThumbnailUrl = req.ThumbnailUrl;

        if (e.Status != req.Status)
        {
            e.Status = req.Status;
            if (req.Status == "Published")
                e.PublishedAtUtc = DateTime.UtcNow;
        }

        e.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("articles/{id:int}")]
    public async Task<ActionResult> DeleteArticle([FromRoute] int id)
    {
        var e = await _db.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();
        _db.Articles.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Leaders
    [HttpGet("leaders")]
    public async Task<ActionResult<IEnumerable<LeaderDto>>> ListLeaders([FromQuery] string? groupKey)
    {
        var q = _db.Leaders.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(groupKey))
            q = q.Where(x => x.GroupKey == groupKey);

        var data = await q
            .OrderBy(x => x.GroupKey)
            .ThenBy(x => x.DisplayOrder)
            .ThenBy(x => x.Id)
            .Select(x => new LeaderDto(x.Id, x.Name, x.Title, x.GroupKey, x.PhotoUrl, x.DisplayOrder, x.IsActive))
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost("leaders")]
    public async Task<ActionResult<LeaderDto>> CreateLeader([FromBody] UpsertLeaderRequest req)
    {
        var e = new Leader
        {
            Name = req.Name,
            Title = req.Title,
            GroupKey = req.GroupKey,
            PhotoUrl = req.PhotoUrl,
            DisplayOrder = req.DisplayOrder,
            IsActive = req.IsActive,
        };

        _db.Leaders.Add(e);
        await _db.SaveChangesAsync();

        return Ok(new LeaderDto(e.Id, e.Name, e.Title, e.GroupKey, e.PhotoUrl, e.DisplayOrder, e.IsActive));
    }

    [HttpPut("leaders/{id:int}")]
    public async Task<ActionResult> UpdateLeader([FromRoute] int id, [FromBody] UpsertLeaderRequest req)
    {
        var e = await _db.Leaders.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        e.Name = req.Name;
        e.Title = req.Title;
        e.GroupKey = req.GroupKey;
        e.PhotoUrl = req.PhotoUrl;
        e.DisplayOrder = req.DisplayOrder;
        e.IsActive = req.IsActive;
        e.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("leaders/{id:int}")]
    public async Task<ActionResult> DeleteLeader([FromRoute] int id)
    {
        var e = await _db.Leaders.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        _db.Leaders.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Comments moderation
    [HttpGet("comments")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> ListComments([FromQuery] bool? approved)
    {
        var q = _db.Comments.AsNoTracking().AsQueryable();
        if (approved.HasValue) q = q.Where(x => x.IsApproved == approved.Value);

        var data = await q
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new CommentDto(x.Id, x.AuthorName, x.AuthorEmail, x.Content, x.IsApproved, x.CreatedAtUtc))
            .ToListAsync();

        return Ok(data);
    }

    [HttpPut("comments/{id:int}/approve")]
    public async Task<ActionResult> ApproveComment([FromRoute] int id)
    {
        var c = await _db.Comments.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        c.IsApproved = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("comments/{id:int}")]
    public async Task<ActionResult> DeleteComment([FromRoute] int id)
    {
        var c = await _db.Comments.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        _db.Comments.Remove(c);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("media/upload")]
    [RequestSizeLimit(20_000_000)]
    public async Task<ActionResult<object>> UploadMedia([FromForm] UploadMediaRequest req)
    {
        var file = req.File;
        var topic = string.IsNullOrWhiteSpace(req.Topic) ? null : req.Topic.Trim();
        var title = string.IsNullOrWhiteSpace(req.Title) ? null : req.Title.Trim();

        if (file is null || file.Length == 0) return BadRequest(new { message = "File không hợp lệ." });

        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext)) ext = ".bin";

        var safeExt = ext.ToLowerInvariant();
        var allowedExt = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".jfif" };
        var allowedType = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp" };
        var byExt = allowedExt.Contains(safeExt);
        var byType = !string.IsNullOrWhiteSpace(file.ContentType) && allowedType.Contains(file.ContentType.ToLowerInvariant());
        if (!byExt && !byType)
            return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF/BMP." });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        Directory.CreateDirectory(uploadsDir);

        var preferredName = BuildPreferredFileName(file.FileName, safeExt);
        var name = EnsureUniqueFileName(uploadsDir, preferredName);

        var fullPath = Path.Combine(uploadsDir, name);
        await using (var fs = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(fs);
        }

        var url = $"/uploads/{name}";

        var m = new Media
        {
            Title = title,
            FileName = name,
            Url = url,
            ContentType = file.ContentType,
            Size = file.Length,
            Topic = topic,
            UploadedByUserId = user.Id,
        };

        _db.Media.Add(m);
        await _db.SaveChangesAsync();

        return Ok(new { id = m.Id, title = m.Title, url = m.Url, fileName = m.FileName, contentType = m.ContentType, size = m.Size, topic = m.Topic });
    }

    [HttpPost("media/{id:int}/replace")]
    [RequestSizeLimit(20_000_000)]
    public async Task<ActionResult<object>> ReplaceMedia([FromRoute] int id, [FromForm] ReplaceMediaRequest req)
    {
        var e = await _db.Media.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        var file = req.File;
        if (file is null || file.Length == 0) return BadRequest(new { message = "File không hợp lệ." });

        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext)) ext = ".bin";

        var safeExt = ext.ToLowerInvariant();
        var allowedExt = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".jfif" };
        var allowedType = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp" };
        var byExt = allowedExt.Contains(safeExt);
        var byType = !string.IsNullOrWhiteSpace(file.ContentType) && allowedType.Contains(file.ContentType.ToLowerInvariant());
        if (!byExt && !byType)
            return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF/BMP." });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        Directory.CreateDirectory(uploadsDir);

        var oldName = Path.GetFileName(e.Url);
        var preferredName = BuildPreferredFileName(file.FileName, safeExt);
        var newName = EnsureUniqueFileName(uploadsDir, preferredName, oldName);
        var newPath = Path.Combine(uploadsDir, newName);

        await using (var fs = System.IO.File.Create(newPath))
        {
            await file.CopyToAsync(fs);
        }

        e.FileName = newName;
        e.Url = $"/uploads/{newName}";
        e.ContentType = file.ContentType;
        e.Size = file.Length;
        e.UploadedByUserId = user.Id;
        e.UploadedAtUtc = DateTime.UtcNow;
        if (req.Title is not null)
            e.Title = string.IsNullOrWhiteSpace(req.Title) ? null : req.Title.Trim();
        if (req.Topic is not null)
            e.Topic = string.IsNullOrWhiteSpace(req.Topic) ? null : req.Topic.Trim();

        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(oldName) && !string.Equals(oldName, newName, StringComparison.OrdinalIgnoreCase))
        {
            var oldPath = Path.Combine(uploadsDir, oldName);
            if (System.IO.File.Exists(oldPath))
            {
                try
                {
                    System.IO.File.Delete(oldPath);
                }
                catch
                {
                    // Keep API successful even if cleanup fails.
                }
            }
        }

        return Ok(new { id = e.Id, title = e.Title, url = e.Url, fileName = e.FileName, contentType = e.ContentType, size = e.Size, topic = e.Topic, uploadedAtUtc = e.UploadedAtUtc });
    }

    [HttpGet("media")]
    public async Task<ActionResult<object>> ListMedia([FromQuery] string? topic)
    {
        var q = _db.Media.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(topic))
            q = q.Where(x => x.Topic == topic);

        var data = await q
            .OrderByDescending(x => x.UploadedAtUtc)
            .Take(100)
            .Select(x => new { x.Id, x.Title, x.FileName, x.Url, x.ContentType, x.Size, x.Topic, x.UploadedAtUtc })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPut("media/{id:int}")]
    public async Task<ActionResult> UpdateMedia([FromRoute] int id, [FromBody] UpdateMediaRequest req)
    {
        var e = await _db.Media.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        if (req.Topic is not null)
            e.Topic = string.IsNullOrWhiteSpace(req.Topic) ? null : req.Topic.Trim();
        if (req.Title is not null)
            e.Title = string.IsNullOrWhiteSpace(req.Title) ? null : req.Title.Trim();
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("media/{id:int}")]
    public async Task<ActionResult> DeleteMedia([FromRoute] int id)
    {
        var e = await _db.Media.FirstOrDefaultAsync(x => x.Id == id);
        if (e is null) return NotFound();

        _db.Media.Remove(e);
        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(e.Url))
        {
            var name = Path.GetFileName(e.Url);
            if (!string.IsNullOrWhiteSpace(name))
            {
                var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                var fullPath = Path.Combine(uploadsDir, name);
                if (System.IO.File.Exists(fullPath))
                {
                    try
                    {
                        System.IO.File.Delete(fullPath);
                    }
                    catch
                    {
                        // Keep API successful even if cleanup fails.
                    }
                }
            }
        }

        return NoContent();
    }

    private static string BuildPreferredFileName(string originalFileName, string safeExt)
    {
        var baseName = Path.GetFileNameWithoutExtension(originalFileName) ?? string.Empty;
        var invalid = Path.GetInvalidFileNameChars();

        var cleaned = new string(baseName
            .Select(ch => invalid.Contains(ch) ? '_' : ch)
            .ToArray())
            .Trim();

        if (string.IsNullOrWhiteSpace(cleaned))
            cleaned = "image";

        return $"{cleaned}{safeExt}";
    }

    private static string EnsureUniqueFileName(string uploadsDir, string preferredFileName, string? reusableFileName = null)
    {
        var ext = Path.GetExtension(preferredFileName);
        var baseName = Path.GetFileNameWithoutExtension(preferredFileName);
        var candidate = preferredFileName;
        var counter = 1;

        while (System.IO.File.Exists(Path.Combine(uploadsDir, candidate)) &&
               !string.Equals(candidate, reusableFileName, StringComparison.OrdinalIgnoreCase))
        {
            candidate = $"{baseName}_{counter}{ext}";
            counter++;
        }

        return candidate;
    }
}
