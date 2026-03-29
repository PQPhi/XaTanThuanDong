namespace XaTanThuanDong.Api.Dtos;

public record ServiceProcedureDto(
    int Id,
    string Name,
    string? Description,
    string? RequiredDocuments,
    string? ProcessingTime,
    string? Fee,
    string? FormTemplateUrl,
    bool IsActive
);

public record UpsertServiceProcedureRequest(
    string Name,
    string? Description,
    string? RequiredDocuments,
    string? ProcessingTime,
    string? Fee,
    string? FormTemplateUrl,
    bool IsActive
);

public record CreateApplicationRequest(
    int ServiceProcedureId,
    string ApplicantName,
    string? ApplicantEmail,
    string? ApplicantPhone,
    string? Address,
    string? AttachmentUrl
);

public record ApplicationDto(
    int Id,
    int ServiceProcedureId,
    string ServiceProcedureName,
    string ApplicantName,
    string? ApplicantEmail,
    string? ApplicantPhone,
    string Status,
    string? Note,
    DateTime SubmittedAtUtc
);

public record UpdateApplicationStatusRequest(string Status, string? Note);
