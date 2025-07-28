using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Repositories
{
    public class LineRepository : ILineRepository
    {
        private readonly AppDbContext _context;
        private readonly WKTReader _reader = new(new GeometryFactory());

        public LineRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LineDto>> GetAllAsync()
        {
            return await _context.Lines
                .Select(l => new LineDto
                {   
                    Id = l.Id,
                    Name = l.Name,
                    WKT = l.Geometry.AsText()
                }).ToListAsync();
        }

        public async Task<LineDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Lines.FindAsync(id);
            if (entity == null) return null;

            return new LineDto
            {
                Name = entity.Name,
                WKT = entity.Geometry.AsText()
            };
        }

        public async Task<LineDto> AddAsync(LineDto dto)
        {
            var entity = new LineEntity
            {
                Name = dto.Name,
                Geometry = _reader.Read(dto.WKT) as LineString ?? throw new Exception("Geçersiz LineString WKT")
            };

            _context.Lines.Add(entity);
            await _context.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Lines.FindAsync(id);
            if (entity == null) return false;

            _context.Lines.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LineDto?> UpdateAsync(int id, LineDto dto)
        {
            var entity = await _context.Lines.FindAsync(id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.Geometry = _reader.Read(dto.WKT) as LineString ?? entity.Geometry;

            await _context.SaveChangesAsync();
            return dto;
        }
        public async Task<bool> DeleteByNameAsync(string name)
        {
            var entity = await _context.Lines.FirstOrDefaultAsync(l => l.Name == name);
            if (entity == null) return false;

            _context.Lines.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
