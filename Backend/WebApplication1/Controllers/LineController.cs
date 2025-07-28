using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Interfaces;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LineController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public LineController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _uow.Lines.GetAllAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Add(LineDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.WKT))
                return BadRequest("WKT boş olamaz.");

            var result = await _uow.Lines.AddAsync(dto);
            return Ok(result);
        }

        [HttpDelete("by-name/{name}")]
        public async Task<IActionResult> DeleteByName(string name)
        {
            var success = await _uow.Lines.DeleteByNameAsync(name);
            if (!success) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _uow.Lines.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
