using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PointEntity> Points { get; set; }
        public DbSet<LineEntity> Lines { get; set; }
        public DbSet<PolygonEntity> Polygons { get; set; }





        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PointEntity>()
                .Property(p => p.Location)
                .HasColumnType("geometry (Point, 4326)");
        }
    }
}
