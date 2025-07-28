using NetTopologySuite.Geometries;

namespace WebApplication1.Models
{
    public class LineEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public LineString Geometry { get; set; } = null!;
    }
}
