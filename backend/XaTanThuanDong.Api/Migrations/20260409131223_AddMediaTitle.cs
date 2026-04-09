using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XaTanThuanDong.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Media",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Media");
        }
    }
}
