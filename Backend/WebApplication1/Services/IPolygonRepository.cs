using WebApplication1.DTOs;

namespace WebApplication1.Services
{
    public interface IPolygonRepository
    {
        Task<bool> DeleteByNameAsync(string name);

        Task<List<PolygonDto>> GetAllAsync();
        Task<PolygonDto?> GetByIdAsync(int id);
        Task<PolygonDto> AddAsync(PolygonDto polygonDto);
        Task<bool> DeleteAsync(int id);
        Task<PolygonDto?> UpdateAsync(int id, PolygonDto polygonDto);
    }
}
