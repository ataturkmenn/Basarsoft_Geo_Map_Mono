using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IPointRepository
    {
        Task<List<PointDto>> GetAllAsync();
        Task<PointDto?> GetByIdAsync(int id);
        Task<PointDto> AddAsync(PointDto pointDto);
        Task<bool> DeleteAsync(int id);
        Task<PointDto?> UpdateAsync(int id, PointDto pointDto);
    }
}
