using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class PointFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Point>(
                name: "Location",
                table: "Points",
                type: "geometry (Point, 4326)",
                nullable: false,
                oldClrType: typeof(Point),
                oldType: "geometry (Point)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Point>(
                name: "Location",
                table: "Points",
                type: "geometry (Point)",
                nullable: true,
                oldClrType: typeof(Point),
                oldType: "geometry (Point, 4326)");
        }
    }
}
