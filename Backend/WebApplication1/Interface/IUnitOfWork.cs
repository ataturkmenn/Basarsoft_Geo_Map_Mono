using System.Threading.Tasks;
using WebApplication1.Repositories;
using WebApplication1.Services;

namespace WebApplication1.Interfaces
{
    public interface IUnitOfWork
    {
        IPointRepository Points { get; }
        ILineRepository Lines { get; }
        IPolygonRepository Polygons { get; }
        Task<int> CompleteAsync();
    }
}
