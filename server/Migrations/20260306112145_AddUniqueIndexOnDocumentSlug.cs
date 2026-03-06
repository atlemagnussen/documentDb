using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserAdmin.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexOnDocumentSlug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Documents",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE "Documents"
                SET "Slug" = CONCAT('document-', "Id")
                WHERE "Slug" IS NULL OR "Slug" = '';
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Documents",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_Slug",
                table: "Documents",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_Slug",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Documents");
        }
    }
}
