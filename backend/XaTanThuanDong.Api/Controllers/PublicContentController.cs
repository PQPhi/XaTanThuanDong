using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Data;
using XaTanThuanDong.Api.Dtos;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Controllers;

[ApiController]
[Route("api/public")]
public class PublicContentController : ControllerBase
{
    private readonly AppDbContext _db;

    public PublicContentController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var data = await _db.Categories
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new CategoryDto(x.Id, x.Name, x.Slug, x.Description, x.IsActive))
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("articles")]
    public async Task<ActionResult<IEnumerable<ArticleListItemDto>>> GetArticles([
        FromQuery] int? categoryId,
        [FromQuery] string? q)
    {
        var query = _db.Articles.AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.Status == "Published");

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId);

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(x => x.Title.Contains(q) || (x.Summary != null && x.Summary.Contains(q)));

        var data = await query
            .OrderByDescending(x => x.PublishedAtUtc)
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

    [HttpGet("articles/{slug}")]
    public async Task<ActionResult<ArticleDetailDto>> GetArticleDetail([FromRoute] string slug)
    {
        var a = await _db.Articles.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug && x.Status == "Published");

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

    [HttpGet("articles/{articleId:int}/comments")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetApprovedComments([FromRoute] int articleId)
    {
        var data = await _db.Comments.AsNoTracking()
            .Where(x => x.ArticleId == articleId && x.IsApproved)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new CommentDto(x.Id, x.AuthorName, x.AuthorEmail, x.Content, x.IsApproved, x.CreatedAtUtc))
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost("articles/{articleId:int}/comments")]
    public async Task<ActionResult> CreateComment([FromRoute] int articleId, [FromBody] CreateCommentRequest req)
    {
        var exists = await _db.Articles.AnyAsync(x => x.Id == articleId && x.Status == "Published");
        if (!exists) return NotFound();

        var c = new Comment
        {
            ArticleId = articleId,
            AuthorName = req.AuthorName,
            AuthorEmail = req.AuthorEmail,
            Content = req.Content,
            IsApproved = false
        };

        _db.Comments.Add(c);
        await _db.SaveChangesAsync();

        return Accepted(new { message = "Bình luận đã được gửi và chờ duyệt." });
    }

    [HttpGet("articles/search")]
    public async Task<ActionResult<IEnumerable<ArticleListItemDto>>> SearchArticles(
        [FromQuery] int? categoryId,
        [FromQuery] string? q,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc)
    {
        var query = _db.Articles.AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.Status == "Published");

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId);

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(x => x.Title.Contains(q) || (x.Summary != null && x.Summary.Contains(q)));

        if (fromUtc.HasValue)
            query = query.Where(x => x.PublishedAtUtc != null && x.PublishedAtUtc >= fromUtc);

        if (toUtc.HasValue)
            query = query.Where(x => x.PublishedAtUtc != null && x.PublishedAtUtc <= toUtc);

        var data = await query
            .OrderByDescending(x => x.PublishedAtUtc)
            .Take(200)
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

    [HttpGet("articles/suggest")]
    public async Task<ActionResult<IEnumerable<string>>> SuggestKeywords([FromQuery] string? q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 2) return Ok(Array.Empty<string>());
        q = q.Trim();

        // gợi ý đơn giản từ tiêu đề bài viết
        var data = await _db.Articles.AsNoTracking()
            .Where(x => x.Status == "Published" && x.Title.Contains(q))
            .OrderByDescending(x => x.PublishedAtUtc)
            .Select(x => x.Title)
            .Distinct()
            .Take(8)
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("leaders")]
    public async Task<ActionResult<IEnumerable<LeaderDto>>> GetLeaders([FromQuery] string? groupKey)
    {
        var q = _db.Leaders.AsNoTracking().Where(x => x.IsActive);
        if (!string.IsNullOrWhiteSpace(groupKey))
            q = q.Where(x => x.GroupKey == groupKey);

        var data = await q
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Id)
            .Select(x => new LeaderDto(x.Id, x.Name, x.Title, x.GroupKey, x.PhotoUrl, x.DisplayOrder, x.IsActive))
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("media")]
    public async Task<ActionResult<object>> GetMedia([FromQuery] string? topic, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 9;
        if (pageSize > 48) pageSize = 48;

        var q = _db.Media.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(topic))
        {
            var normalizedTopic = topic.Trim();
            if (string.Equals(normalizedTopic, "gallery", StringComparison.OrdinalIgnoreCase))
            {
                // Backward compatibility: old uploads may have empty topic.
                q = q.Where(x => x.Topic == "gallery" || x.Topic == null || x.Topic == "");
            }
            else
            {
                q = q.Where(x => x.Topic == normalizedTopic);
            }
        }

        Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
        Response.Headers.Pragma = "no-cache";
        Response.Headers.Expires = "0";

        var total = await q.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)pageSize));
        if (page > totalPages) page = totalPages;

        var items = await q
            .OrderByDescending(x => x.UploadedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new { x.Id, x.FileName, x.Url, x.Topic, x.UploadedAtUtc })
            .ToListAsync();

        return Ok(new { items, page, pageSize, total, totalPages });
    }
}
