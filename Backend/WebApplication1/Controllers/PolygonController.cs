using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Interfaces;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PolygonController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public PolygonController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _uow.Polygons.GetAllAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Add(PolygonDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.WKT))
                return BadRequest("WKT boş olamaz.");

            var result = await _uow.Polygons.AddAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _uow.Polygons.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok();
        }

        [HttpDelete("by-name/{name}")]
        public async Task<IActionResult> DeleteByName(string name)
        {
            var success = await _uow.Polygons.DeleteByNameAsync(name);
            if (!success) return NotFound();
            return Ok();
        }


    }
}
