using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Services;

namespace WebApplication1.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IPointRepository Points { get; }
        public ILineRepository Lines { get; }
        public IPolygonRepository Polygons { get; }

        public UnitOfWork(
             AppDbContext context,
             IPointRepository pointRepository,
             ILineRepository lineRepository,
             IPolygonRepository polygonRepository)
        {
            _context = context;
            Points = pointRepository;
            Lines = lineRepository;
            Polygons = polygonRepository;
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
