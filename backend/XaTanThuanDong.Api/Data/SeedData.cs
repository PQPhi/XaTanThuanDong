using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using XaTanThuanDong.Api.Models;

namespace XaTanThuanDong.Api.Data;

public static class SeedData
{
    public static async Task EnsureSeededAsync(IServiceProvider sp)
    {
        var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = sp.GetRequiredService<UserManager<AppUser>>();
        var db = sp.GetRequiredService<AppDbContext>();

        var roles = new[] { "Admin", "Editor", "Viewer" };
        foreach (var r in roles)
        {
            if (!await roleManager.RoleExistsAsync(r))
                await roleManager.CreateAsync(new IdentityRole(r));
        }

        // admin default
        var adminEmail = "admin@xatanthuandong.local";
        var admin = await userManager.Users.FirstOrDefaultAsync(x => x.Email == adminEmail);
        if (admin is null)
        {
            admin = new AppUser
            {
                Email = adminEmail,
                UserName = adminEmail,
                EmailConfirmed = true,
                FullName = "Quản trị - Xã Tân Thuận Đông",
                IsActive = true
            };

            // password demo: Admin@123
            var createResult = await userManager.CreateAsync(admin, "Admin@123");
            if (!createResult.Succeeded)
                throw new InvalidOperationException(string.Join("; ", createResult.Errors.Select(e => e.Description)));
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
            await userManager.AddToRoleAsync(admin, "Admin");

        // sample categories
        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Name = "Thông báo", Slug = "thong-bao", Description = "Thông báo của UBND xã" },
                new Category { Name = "Hoạt động - Sự kiện", Slug = "hoat-dong-su-kien", Description = "Tin hoạt động địa phương" },
                new Category { Name = "Văn bản", Slug = "van-ban", Description = "Văn bản chỉ đạo, điều hành" }
            );
            await db.SaveChangesAsync();
        }

        // sample services (common commune/ward procedures)
        // Seed is idempotent: add any missing items by Name.
        var commonProcedures = new List<ServiceProcedure>
        {
            new()
            {
                Name = "Đăng ký khai sinh",
                Description = "Thực hiện đăng ký khai sinh cho trẻ em theo quy định pháp luật về hộ tịch.",
                ProcessingTime = "Trong ngày (nếu hồ sơ đầy đủ)",
                Fee = "Miễn phí (đúng hạn)",
                RequiredDocuments = "Tờ khai đăng ký khai sinh; Giấy chứng sinh (hoặc giấy tờ thay thế); CCCD/CMND của cha mẹ/người đi khai; Sổ hộ khẩu/Thông tin cư trú (nếu cần).",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký khai tử",
                Description = "Đăng ký khai tử cho người đã chết.",
                ProcessingTime = "Trong ngày",
                Fee = "Miễn phí",
                RequiredDocuments = "Tờ khai đăng ký khai tử; Giấy báo tử/giấy tờ thay thế; CCCD/CMND người đi khai; Thông tin cư trú (nếu cần).",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký kết hôn",
                Description = "Đăng ký kết hôn trong nước.",
                ProcessingTime = "Trong ngày",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai đăng ký kết hôn; CCCD/CMND của hai bên; Giấy xác nhận tình trạng hôn nhân (nếu cần); Giấy tờ chứng minh nơi cư trú.",
                IsActive = true
            },
            new()
            {
                Name = "Cấp bản sao trích lục hộ tịch",
                Description = "Cấp bản sao/trích lục khai sinh, kết hôn, khai tử...",
                ProcessingTime = "Trong ngày",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai yêu cầu; CCCD/CMND; Thông tin sự kiện hộ tịch cần trích lục.",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận tình trạng hôn nhân",
                Description = "Cấp giấy xác nhận tình trạng hôn nhân theo yêu cầu.",
                ProcessingTime = "03 ngày làm việc",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai theo mẫu; CCCD/CMND; Thông tin cư trú; Giấy tờ liên quan (nếu đã từng kết hôn/ly hôn).",
                IsActive = true
            },
            new()
            {
                Name = "Hỗ trợ/Hướng dẫn thủ tục ly hôn",
                Description = "Hướng dẫn hồ sơ, biểu mẫu, nơi nộp và quy trình giải quyết ly hôn theo thẩm quyền Tòa án.",
                ProcessingTime = "Theo quy định của Tòa án",
                Fee = "Theo quy định",
                RequiredDocuments = "Đơn yêu cầu/đơn khởi kiện ly hôn; Giấy đăng ký kết hôn (bản chính); CCCD/CMND; Giấy khai sinh con (nếu có); Tài liệu về tài sản chung (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Chứng thực bản sao từ bản chính",
                Description = "Chứng thực bản sao giấy tờ, văn bằng, chứng chỉ.",
                ProcessingTime = "Trong ngày",
                Fee = "Theo trang/loại giấy tờ",
                RequiredDocuments = "Bản chính; Bản sao; CCCD/CMND.",
                IsActive = true
            },
            new()
            {
                Name = "Chứng thực chữ ký",
                Description = "Chứng thực chữ ký trong các giấy tờ, văn bản.",
                ProcessingTime = "Trong ngày",
                Fee = "Theo quy định",
                RequiredDocuments = "Giấy tờ/văn bản cần chứng thực; CCCD/CMND; Ký trực tiếp trước mặt cán bộ tiếp nhận.",
                IsActive = true
            },
            new()
            {
                Name = "Chứng thực hợp đồng, giao dịch",
                Description = "Chứng thực hợp đồng, giao dịch (một số trường hợp theo quy định).",
                ProcessingTime = "Trong ngày/01-02 ngày",
                Fee = "Theo giá trị/hồ sơ",
                RequiredDocuments = "Dự thảo hợp đồng; Giấy tờ tùy thân; Giấy tờ về tài sản liên quan (nếu có); Giấy tờ chứng minh quyền/giấy tờ khác theo từng loại hợp đồng.",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận cư trú/Thông tin cư trú",
                Description = "Xác nhận thông tin về cư trú theo cơ sở dữ liệu cư trú.",
                ProcessingTime = "Trong ngày",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai/đề nghị; CCCD/CMND; Thông tin cần xác nhận.",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận hộ nghèo/cận nghèo",
                Description = "Xác nhận tình trạng hộ nghèo/cận nghèo để hưởng chính sách.",
                ProcessingTime = "05 ngày làm việc",
                Fee = "Miễn phí",
                RequiredDocuments = "Đơn đề nghị; CCCD/CMND; Sổ hộ khẩu/thông tin cư trú; Giấy tờ chứng minh theo hướng dẫn.",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận hoàn cảnh khó khăn",
                Description = "Xác nhận hoàn cảnh khó khăn để làm thủ tục học phí, vay vốn, trợ cấp...",
                ProcessingTime = "03-05 ngày làm việc",
                Fee = "Miễn phí",
                RequiredDocuments = "Đơn đề nghị; CCCD/CMND; Tài liệu chứng minh (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký tạm trú",
                Description = "Tiếp nhận/hướng dẫn đăng ký tạm trú theo quy định.",
                ProcessingTime = "Theo quy định",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai thay đổi thông tin cư trú; CCCD; Giấy tờ chỗ ở hợp pháp (nếu cần).",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký tạm vắng",
                Description = "Tiếp nhận/hướng dẫn đăng ký tạm vắng.",
                ProcessingTime = "Theo quy định",
                Fee = "Miễn phí",
                RequiredDocuments = "Tờ khai; CCCD; Thông tin thời gian, nơi đến.",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký thường trú (tiếp nhận/hướng dẫn)",
                Description = "Tiếp nhận/hướng dẫn hồ sơ đăng ký thường trú theo thẩm quyền cơ quan công an.",
                ProcessingTime = "Theo quy định",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai; CCCD; Giấy tờ chứng minh chỗ ở hợp pháp/quan hệ; hồ sơ theo từng trường hợp.",
                IsActive = true
            },
            new()
            {
                Name = "Giấy phép xây dựng nhà ở riêng lẻ (tiếp nhận/hướng dẫn)",
                Description = "Tiếp nhận/hướng dẫn hồ sơ xin phép xây dựng theo thẩm quyền.",
                ProcessingTime = "Theo quy định",
                Fee = "Theo quy định",
                RequiredDocuments = "Đơn đề nghị; Bản vẽ thiết kế; Giấy tờ về quyền sử dụng đất; CCCD; hồ sơ khác theo yêu cầu.",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận hiện trạng nhà đất",
                Description = "Xác nhận hiện trạng sử dụng đất, nhà ở (khi được yêu cầu theo quy định).",
                ProcessingTime = "05-07 ngày làm việc",
                Fee = "Theo quy định",
                RequiredDocuments = "Đơn đề nghị; Giấy tờ nhà/đất; CCCD/CMND; Trích lục bản đồ/giấy tờ liên quan (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Tiếp nhận phản ánh kiến nghị (đường dây nóng)",
                Description = "Tiếp nhận phản ánh về an ninh trật tự, môi trường, hạ tầng, thủ tục hành chính...",
                ProcessingTime = "Tiếp nhận ngay",
                Fee = "Miễn phí",
                RequiredDocuments = "Nội dung phản ánh; hình ảnh/tài liệu kèm theo (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Xác nhận vay vốn (Ngân hàng chính sách)",
                Description = "Xác nhận hồ sơ vay vốn và các chương trình tín dụng chính sách.",
                ProcessingTime = "03-07 ngày làm việc",
                Fee = "Miễn phí",
                RequiredDocuments = "Đơn đề nghị; CCCD/CMND; hồ sơ theo chương trình vay (hộ nghèo, HSSV, nước sạch...).",
                IsActive = true
            },
            new()
            {
                Name = "Trợ cấp xã hội (tiếp nhận/hướng dẫn)",
                Description = "Tiếp nhận/hướng dẫn hồ sơ trợ cấp người cao tuổi, khuyết tật, bảo trợ...",
                ProcessingTime = "Theo quy định",
                Fee = "Miễn phí",
                RequiredDocuments = "Đơn đề nghị; CCCD/CMND; giấy tờ chứng minh đối tượng; hồ sơ y tế (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Bảo hiểm y tế (hướng dẫn)",
                Description = "Hướng dẫn tham gia, gia hạn BHYT hộ gia đình, đối tượng chính sách.",
                ProcessingTime = "Theo quy định",
                Fee = "Theo quy định",
                RequiredDocuments = "Tờ khai; CCCD; thông tin hộ gia đình; giấy tờ đối tượng (nếu có).",
                IsActive = true
            },
            new()
            {
                Name = "Hỗ trợ đăng ký/khóa tài khoản định danh điện tử (VNeID)",
                Description = "Hỗ trợ người dân đăng ký, cập nhật thông tin định danh điện tử theo hướng dẫn.",
                ProcessingTime = "Theo lịch hỗ trợ",
                Fee = "Miễn phí",
                RequiredDocuments = "CCCD gắn chip; điện thoại; thông tin tài khoản.",
                IsActive = true
            },
            new()
            {
                Name = "Đăng ký kinh doanh hộ cá thể (tiếp nhận/hướng dẫn)",
                Description = "Tiếp nhận/hướng dẫn hồ sơ đăng ký hộ kinh doanh.",
                ProcessingTime = "03 ngày làm việc",
                Fee = "Theo quy định",
                RequiredDocuments = "Đơn đăng ký; CCCD/CMND; hợp đồng thuê/mượn địa điểm (nếu có); giấy tờ khác theo quy định.",
                IsActive = true
            },
            new()
            {
                Name = "Văn hóa - xã hội: xác nhận lý lịch/nhân thân",
                Description = "Xác nhận một số nội dung nhân thân theo đề nghị và đúng thẩm quyền.",
                ProcessingTime = "03-05 ngày làm việc",
                Fee = "Miễn phí",
                RequiredDocuments = "Đơn đề nghị; CCCD/CMND; giấy tờ liên quan.",
                IsActive = true
            },
        };

        var existingNames = await db.ServiceProcedures
            .AsNoTracking()
            .Select(x => x.Name)
            .ToListAsync();

        var toAdd = commonProcedures
            .Where(p => !existingNames.Contains(p.Name))
            .ToList();

        if (toAdd.Count > 0)
        {
            db.ServiceProcedures.AddRange(toAdd);
            await db.SaveChangesAsync();
        }

        // sample article
        if (!await db.Articles.AnyAsync())
        {
            var catId = await db.Categories.Select(x => x.Id).FirstAsync();
            db.Articles.Add(new Article
            {
                CategoryId = catId,
                Title = "Chào mừng đến với Cổng thông tin Xã Tân Thuận Đông",
                Slug = "chao-mung-den-voi-cong-thong-tin-xa-tan-thuan-dong",
                Summary = "Website quảng bá và cung cấp dịch vụ hành chính trực tuyến.",
                ContentHtml = "<p>Đây là bài viết mẫu. Bạn có thể chỉnh sửa trong trang quản trị.</p>",
                Status = "Published",
                PublishedAtUtc = DateTime.UtcNow,
                CreatedByUserId = admin.Id
            });
            await db.SaveChangesAsync();
        }

        // Seed Articles
        if (!db.Articles.Any())
        {
            var generalCat = db.Categories.FirstOrDefault(x => x.Slug == "thong-bao") ?? db.Categories.First();

            db.Articles.AddRange(
                new Article
                {
                    CategoryId = generalCat.Id,
                    Title = "Chợ Cù Lao – Nét sinh hoạt đặc trưng của Xã Tân Thuận Đông",
                    Slug = "cho-cu-lao-net-sinh-hoat-dac-trung",
                    Summary = "Chợ Cù Lao là điểm giao thương quen thuộc, phản ánh nhịp sống bình dị của người dân địa phương.",
                    ContentHtml = "<p><b>Chợ Cù Lao</b> là nơi mua bán – trao đổi hàng hoá sôi động, gắn với đời sống sinh hoạt của người dân.</p><p>Bài viết mẫu: bạn có thể thay bằng nội dung chính thức, hình ảnh thực tế và lịch hoạt động.</p>",
                    Status = "Published",
                    PublishedAtUtc = DateTime.UtcNow.AddDays(-3),
                    ThumbnailUrl = "/hero/0.png",
                    CreatedByUserId = admin.Id
                },
                new Article
                {
                    CategoryId = generalCat.Id,
                    Title = "Thông báo: Cập nhật cổng thông tin điện tử",
                    Slug = "thong-bao-cap-nhat-cong-thong-tin",
                    Summary = "Cổng thông tin được cập nhật để phục vụ người dân tra cứu tin tức và dịch vụ hành chính trực tuyến.",
                    ContentHtml = "<p>Hệ thống được bổ sung các mục: <b>Tin tức</b>, <b>Dịch vụ hành chính</b>, <b>Thư viện</b> và <b>Liên hệ</b>.</p><p>Vui lòng phản hồi nếu có lỗi hiển thị hoặc góp ý nội dung.</p>",
                    Status = "Published",
                    PublishedAtUtc = DateTime.UtcNow.AddDays(-2),
                    ThumbnailUrl = "/hero/1.png",
                    CreatedByUserId = admin.Id
                },
                new Article
                {
                    CategoryId = generalCat.Id,
                    Title = "Hướng dẫn: Nộp hồ sơ trực tuyến và tra cứu trạng thái",
                    Slug = "huong-dan-nop-ho-so-truc-tuyen",
                    Summary = "Người dân có thể nộp hồ sơ trực tuyến và tra cứu trạng thái xử lý theo mã hồ sơ.",
                    ContentHtml = "<p>Vào mục <b>Dịch vụ</b> để chọn thủ tục, nhập thông tin và gửi hồ sơ.</p><p>Sau khi gửi, hệ thống trả về <b>mã hồ sơ</b> để tra cứu trạng thái xử lý.</p>",
                    Status = "Published",
                    PublishedAtUtc = DateTime.UtcNow.AddDays(-1),
                    ThumbnailUrl = "/hero/2.png",
                    CreatedByUserId = admin.Id
                }
            );

            await db.SaveChangesAsync();
        }

        // sample leaders
        if (!await db.Leaders.AnyAsync())
        {
            db.Leaders.AddRange(
                new Leader
                {
                    Name = "Lê Thị Phi Yến",
                    Title = "Bí thư Đảng ủy, Chủ tịch HĐND xã",
                    GroupKey = "lanh-dao",
                    // Ảnh online (placeholder) để luôn hiển thị được khi demo
                    PhotoUrl = "https://picsum.photos/seed/lanhdao1/600/600",
                    DisplayOrder = 1,
                    IsActive = true
                },
                new Leader
                {
                    Name = "Phạm Minh Tấn",
                    Title = "Phó Bí thư Thường trực Đảng ủy xã",
                    GroupKey = "lanh-dao",
                    PhotoUrl = "https://picsum.photos/seed/lanhdao2/600/600",
                    DisplayOrder = 2,
                    IsActive = true
                },
                new Leader
                {
                    Name = "Lê Quang Biểu",
                    Title = "Phó Bí thư Đảng ủy, Chủ tịch UBND xã",
                    GroupKey = "lanh-dao",
                    PhotoUrl = "https://picsum.photos/seed/lanhdao3/600/600",
                    DisplayOrder = 3,
                    IsActive = true
                }
            );
            await db.SaveChangesAsync();
        }
    }
}
