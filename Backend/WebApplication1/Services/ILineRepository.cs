using WebApplication1.DTOs;

namespace WebApplication1.Services
{
    public interface ILineRepository
    {
        Task<bool> DeleteByNameAsync(string name);

        Task<List<LineDto>> GetAllAsync();
        Task<LineDto?> GetByIdAsync(int id);
        Task<LineDto> AddAsync(LineDto lineDto);
        Task<bool> DeleteAsync(int id);
        Task<LineDto?> UpdateAsync(int id, LineDto lineDto);
    }
}
