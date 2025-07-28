using Microsoft.EntityFrameworkCore;
using NetTopologySuite.IO;
using NetTopologySuite.Geometries;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class PointRepository : IPointRepository
    {
        private readonly AppDbContext _context;
        private readonly WKTReader _reader = new(new GeometryFactory());

        public PointRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PointDto>> GetAllAsync()
        {
            return await _context.Points
                .Select(p => new PointDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    WKT = p.Location.AsText()
                }).ToListAsync();
        }

        public async Task<PointDto?> GetByIdAsync(int id)
        {
            var point = await _context.Points.FindAsync(id);
            if (point == null) return null;

            return new PointDto
            {
                Name = point.Name,
                WKT = point.Location.AsText()
            };
        }

        public async Task<PointDto> AddAsync(PointDto dto)
        {
            var entity = new PointEntity
            {
                Name = dto.Name,
                Location = _reader.Read(dto.WKT) as Point ?? throw new InvalidDataException("Invalid WKT")
            };

            _context.Points.Add(entity);
            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var point = await _context.Points.FindAsync(id);
            if (point == null) return false;

            _context.Points.Remove(point);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PointDto?> UpdateAsync(int id, PointDto dto)
        {
            var entity = await _context.Points.FindAsync(id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.Location = _reader.Read(dto.WKT) as Point ?? entity.Location;

            await _context.SaveChangesAsync();

            return dto;
        }
    }
}
