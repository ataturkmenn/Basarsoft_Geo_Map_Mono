using NetTopologySuite.Geometries;

namespace WebApplication1.Models
{
    public class PointEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Point Location { get; set; } = null!;
    }
}
