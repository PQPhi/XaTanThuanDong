using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

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
    public async Task<ActionResult<object>> UploadMedia([FromForm] IFormFile file, [FromForm] string? topic)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "File không hợp lệ." });

        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF." });

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext)) ext = ".bin";

        var safeExt = ext.ToLowerInvariant();
        var name = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{Guid.NewGuid():N}{safeExt}";

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        Directory.CreateDirectory(uploadsDir);

        var fullPath = Path.Combine(uploadsDir, name);
        await using (var fs = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(fs);
        }

        var url = $"/uploads/{name}";

        var m = new Media
        {
            FileName = name,
            Url = url,
            ContentType = file.ContentType,
            Size = file.Length,
            Topic = topic,
            UploadedByUserId = user.Id,
        };

        _db.Media.Add(m);
        await _db.SaveChangesAsync();

        return Ok(new { id = m.Id, url = m.Url, fileName = m.FileName, contentType = m.ContentType, size = m.Size, topic = m.Topic });
    }

    [HttpGet("media")]
    public async Task<ActionResult<IEnumerable<object>>> ListMedia([FromQuery] string? topic)
    {
        var q = _db.Media.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(topic))
            q = q.Where(x => x.Topic == topic);

        var data = await q
            .OrderByDescending(x => x.UploadedAtUtc)
            .Take(100)
            .Select(x => new { x.Id, x.FileName, x.Url, x.ContentType, x.Size, x.Topic, x.UploadedAtUtc })
            .ToListAsync();

        return Ok(data);
    }
}
