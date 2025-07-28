using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Repositories
{
    public class PolygonRepository : IPolygonRepository
    {
        private readonly AppDbContext _context;
        private readonly WKTReader _reader = new(new GeometryFactory());

        public PolygonRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PolygonDto>> GetAllAsync()
        {
            return await _context.Polygons
                .Select(p => new PolygonDto
                {
                    Id = p.Id,  
                    Name = p.Name,
                    WKT = p.Geometry.AsText()
                }).ToListAsync();
        }

        public async Task<PolygonDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Polygons.FindAsync(id);
            if (entity == null) return null;

            return new PolygonDto
            {
                Name = entity.Name,
                WKT = entity.Geometry.AsText()
            };
        }

        public async Task<PolygonDto> AddAsync(PolygonDto dto)
        {
            var entity = new PolygonEntity
            {
                Name = dto.Name,
                Geometry = _reader.Read(dto.WKT) as Polygon ?? throw new Exception("Geçersiz Polygon WKT")
            };

            _context.Polygons.Add(entity);
            await _context.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Polygons.FindAsync(id);
            if (entity == null) return false;

            _context.Polygons.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PolygonDto?> UpdateAsync(int id, PolygonDto dto)
        {
            var entity = await _context.Polygons.FindAsync(id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.Geometry = _reader.Read(dto.WKT) as Polygon ?? entity.Geometry;

            await _context.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteByNameAsync(string name)
        {
            var entity = await _context.Polygons.FirstOrDefaultAsync(l => l.Name == name);
            if (entity == null) return false;

            _context.Polygons.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
