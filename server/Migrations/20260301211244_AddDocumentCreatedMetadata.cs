using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserAdmin.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentCreatedMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Documents",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "now()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Documents",
                type: "character varying(36)",
                maxLength: 36,
                nullable: false,
                defaultValue: "b9267a56-51a0-434f-a371-6a71d07ff15b");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Documents");
        }
    }
}
