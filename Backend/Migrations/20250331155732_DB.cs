using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelApp.Migrations
{
    /// <inheritdoc />
    public partial class DB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TravelappItems",
                newName: "Place");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "TravelappItems",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "DateStart",
                table: "TravelappItems",
                newName: "DateTo");

            migrationBuilder.RenameColumn(
                name: "DateEnd",
                table: "TravelappItems",
                newName: "DateFrom");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Place",
                table: "TravelappItems",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "TravelappItems",
                newName: "Image");

            migrationBuilder.RenameColumn(
                name: "DateTo",
                table: "TravelappItems",
                newName: "DateStart");

            migrationBuilder.RenameColumn(
                name: "DateFrom",
                table: "TravelappItems",
                newName: "DateEnd");
        }
    }
}
