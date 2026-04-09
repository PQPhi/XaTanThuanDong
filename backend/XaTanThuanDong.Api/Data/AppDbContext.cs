using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Media> Media => Set<Media>();
    public DbSet<ServiceProcedure> ServiceProcedures => Set<ServiceProcedure>();
    public DbSet<ServiceApplication> ServiceApplications => Set<ServiceApplication>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Leader> Leaders => Set<Leader>();



    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Dùng tên bảng tiếng Việt (dbo) theo DB hiện có
        //builder.Entity<Category>().ToTable("DanhMuc");
        //builder.Entity<Article>().ToTable("BaiViet");
        //builder.Entity<Comment>().ToTable("BinhLuan");
        //builder.Entity<Media>().ToTable("Media");
        //builder.Entity<ServiceProcedure>().ToTable("ThuTucHanhChinh");
        //builder.Entity<ServiceApplication>().ToTable("HoSoDichVu");
        //builder.Entity<AuditLog>().ToTable("LichSu");
        //builder.Entity<Leader>().ToTable("LanhDao");

        builder.Entity<Category>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(220).IsRequired();
        });

        builder.Entity<Article>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => new { x.CategoryId, x.Status, x.PublishedAtUtc });
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(320).IsRequired();
            e.Property(x => x.Status).HasMaxLength(20).IsRequired();
            e.HasOne(x => x.Category).WithMany(x => x.Articles).HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.CreatedByUser).WithMany().HasForeignKey(x => x.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Comment>(e =>
        {
            e.HasIndex(x => new { x.ArticleId, x.IsApproved, x.CreatedAtUtc });
            e.Property(x => x.AuthorName).HasMaxLength(200).IsRequired();
            e.Property(x => x.AuthorEmail).HasMaxLength(256);
            e.Property(x => x.Content).HasMaxLength(2000).IsRequired();
            e.HasOne(x => x.Article).WithMany(x => x.Comments).HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Media>(e =>
        {
            e.HasIndex(x => x.Topic);
            e.Property(x => x.Title).HasMaxLength(300);
            e.Property(x => x.FileName).HasMaxLength(255).IsRequired();
            e.Property(x => x.Url).HasMaxLength(500).IsRequired();
            e.Property(x => x.ContentType).HasMaxLength(100).IsRequired();
            e.HasOne(x => x.UploadedByUser).WithMany().HasForeignKey(x => x.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ServiceProcedure>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(300).IsRequired();
            e.HasIndex(x => x.Name);
        });

        builder.Entity<ServiceApplication>(e =>
        {
            e.HasIndex(x => new { x.ServiceProcedureId, x.Status, x.SubmittedAtUtc });
            e.Property(x => x.ApplicantName).HasMaxLength(200).IsRequired();
            e.Property(x => x.ApplicantEmail).HasMaxLength(256);
            e.Property(x => x.ApplicantPhone).HasMaxLength(20);
            e.Property(x => x.Status).HasMaxLength(30).IsRequired();
            e.HasOne(x => x.ServiceProcedure).WithMany(x => x.Applications).HasForeignKey(x => x.ServiceProcedureId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<AuditLog>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.CreatedAtUtc });
            e.Property(x => x.UserId).HasMaxLength(450).IsRequired();
            e.Property(x => x.Action).HasMaxLength(200).IsRequired();
            e.Property(x => x.EntityName).HasMaxLength(200);
            e.Property(x => x.EntityId).HasMaxLength(100);
            e.Property(x => x.IpAddress).HasMaxLength(60);
        });

        builder.Entity<Leader>(e =>
        {
            e.HasIndex(x => new { x.GroupKey, x.IsActive, x.DisplayOrder });
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Title).HasMaxLength(300).IsRequired();
            e.Property(x => x.GroupKey).HasMaxLength(80).IsRequired();
            e.Property(x => x.PhotoUrl).HasMaxLength(500);
        });
    }
}
