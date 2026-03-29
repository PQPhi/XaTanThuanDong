namespace XaTanThuanDong.Api.Dtos;

public record CategoryDto(int Id, string Name, string Slug, string? Description, bool IsActive);
public record UpsertCategoryRequest(string Name, string Slug, string? Description, bool IsActive);

public record ArticleListItemDto(
    int Id,
    int CategoryId,
    string CategoryName,
    string Title,
    string Slug,
    string? Summary,
    string Status,
    DateTime? PublishedAtUtc,
    string? ThumbnailUrl
);

public record ArticleDetailDto(
    int Id,
    int CategoryId,
    string Title,
    string Slug,
    string? Summary,
    string ContentHtml,
    string Status,
    DateTime? PublishedAtUtc,
    string? ThumbnailUrl
);

public record UpsertArticleRequest(
    int CategoryId,
    string Title,
    string Slug,
    string? Summary,
    string ContentHtml,
    string Status,
    string? ThumbnailUrl
);

public record CreateCommentRequest(string AuthorName, string? AuthorEmail, string Content);
public record CommentDto(int Id, string AuthorName, string? AuthorEmail, string Content, bool IsApproved, DateTime CreatedAtUtc);

public record LeaderDto(
    int Id,
    string Name,
    string Title,
    string GroupKey,
    string? PhotoUrl,
    int DisplayOrder,
    bool IsActive
);

public record UpsertLeaderRequest(
    string Name,
    string Title,
    string GroupKey,
    string? PhotoUrl,
    int DisplayOrder,
    bool IsActive
);
