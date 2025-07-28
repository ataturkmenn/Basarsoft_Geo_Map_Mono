using NetTopologySuite.Geometries;

namespace WebApplication1.Models
{
    public class PolygonEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Polygon Geometry { get; set; } = null!;
    }
}
