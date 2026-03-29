using FluentValidation;
using XaTanThuanDong.Api.Dtos;

namespace XaTanThuanDong.Api.Validators;

public class UpsertCategoryRequestValidator : AbstractValidator<UpsertCategoryRequest>
{
    public UpsertCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên danh mục là bắt buộc.")
            .MaximumLength(150).WithMessage("Tên danh mục tối đa 150 ký tự.");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug là bắt buộc.")
            .MaximumLength(200).WithMessage("Slug tối đa 200 ký tự.")
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug chỉ gồm chữ thường, số và dấu gạch ngang (-).");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Mô tả tối đa 500 ký tự.");
    }
}

public class UpsertArticleRequestValidator : AbstractValidator<UpsertArticleRequest>
{
    public UpsertArticleRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId không hợp lệ.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề là bắt buộc.")
            .MaximumLength(250).WithMessage("Tiêu đề tối đa 250 ký tự.");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug là bắt buộc.")
            .MaximumLength(200).WithMessage("Slug tối đa 200 ký tự.")
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug chỉ gồm chữ thường, số và dấu gạch ngang (-).");

        RuleFor(x => x.Summary)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.Summary))
            .WithMessage("Tóm tắt tối đa 500 ký tự.");

        RuleFor(x => x.ContentHtml)
            .NotEmpty().WithMessage("Nội dung là bắt buộc.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Trạng thái là bắt buộc.")
            .Must(s => s is "Draft" or "Published" or "Archived")
            .WithMessage("Status chỉ nhận: Draft, Published, Archived.");

        RuleFor(x => x.ThumbnailUrl)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.ThumbnailUrl))
            .WithMessage("ThumbnailUrl tối đa 1000 ký tự.");
    }
}

public class CreateCommentRequestValidator : AbstractValidator<CreateCommentRequest>
{
    public CreateCommentRequestValidator()
    {
        RuleFor(x => x.AuthorName)
            .NotEmpty().WithMessage("Tên người gửi là bắt buộc.")
            .MaximumLength(100).WithMessage("Tên người gửi tối đa 100 ký tự.");

        RuleFor(x => x.AuthorEmail)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.AuthorEmail))
            .WithMessage("Email không hợp lệ.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Nội dung bình luận là bắt buộc.")
            .MaximumLength(1000).WithMessage("Nội dung bình luận tối đa 1000 ký tự.");
    }
}
