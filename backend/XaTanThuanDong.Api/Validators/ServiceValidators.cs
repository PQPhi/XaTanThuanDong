using FluentValidation;
using XaTanThuanDong.Api.Dtos;

namespace XaTanThuanDong.Api.Validators;

public class UpsertServiceProcedureRequestValidator : AbstractValidator<UpsertServiceProcedureRequest>
{
    public UpsertServiceProcedureRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên thủ tục là bắt buộc.")
            .MaximumLength(200).WithMessage("Tên thủ tục tối đa 200 ký tự.");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Mô tả tối đa 2000 ký tự.");

        RuleFor(x => x.RequiredDocuments)
            .MaximumLength(2000)
            .When(x => !string.IsNullOrWhiteSpace(x.RequiredDocuments))
            .WithMessage("Giấy tờ yêu cầu tối đa 2000 ký tự.");

        RuleFor(x => x.ProcessingTime)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.ProcessingTime))
            .WithMessage("Thời gian xử lý tối đa 200 ký tự.");

        RuleFor(x => x.Fee)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.Fee))
            .WithMessage("Lệ phí tối đa 200 ký tự.");

        RuleFor(x => x.FormTemplateUrl)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.FormTemplateUrl))
            .WithMessage("FormTemplateUrl tối đa 1000 ký tự.");
    }
}

public class CreateApplicationRequestValidator : AbstractValidator<CreateApplicationRequest>
{
    public CreateApplicationRequestValidator()
    {
        RuleFor(x => x.ServiceProcedureId)
            .GreaterThan(0).WithMessage("ServiceProcedureId không hợp lệ.");

        RuleFor(x => x.ApplicantName)
            .NotEmpty().WithMessage("Họ tên người nộp là bắt buộc.")
            .MaximumLength(150).WithMessage("Họ tên người nộp tối đa 150 ký tự.");

        RuleFor(x => x.ApplicantEmail)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.ApplicantEmail))
            .WithMessage("Email không hợp lệ.");

        RuleFor(x => x.ApplicantPhone)
            .MaximumLength(30)
            .When(x => !string.IsNullOrWhiteSpace(x.ApplicantPhone))
            .WithMessage("Số điện thoại tối đa 30 ký tự.");

        RuleFor(x => x.Address)
            .MaximumLength(300)
            .When(x => !string.IsNullOrWhiteSpace(x.Address))
            .WithMessage("Địa chỉ tối đa 300 ký tự.");

        RuleFor(x => x.AttachmentUrl)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.AttachmentUrl))
            .WithMessage("AttachmentUrl tối đa 1000 ký tự.");
    }
}

public class UpdateApplicationStatusRequestValidator : AbstractValidator<UpdateApplicationStatusRequest>
{
    public UpdateApplicationStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Trạng thái là bắt buộc.")
            .Must(s => s is "Submitted" or "Processing" or "Approved" or "Rejected")
            .WithMessage("Status chỉ nhận: Submitted, Processing, Approved, Rejected.");

        RuleFor(x => x.Note)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.Note))
            .WithMessage("Ghi chú tối đa 1000 ký tự.");
    }
}
