using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModulesController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public ModulesController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddModule")]
        public async Task<IActionResult> AddModule([FromBody] Module dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ModuleName))
                return BadRequest(new { Message = "ModuleName is required." });

            var module = new Module
            {
                ModuleName = dto.ModuleName,
                ModuleDescription = dto.ModuleDescription,
                UploadedMaterial = dto.UploadedMaterial
            };

            _context.Modules.Add(module);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Module '{module.ModuleName}' added successfully.",
                module.ModuleID
            });
        }

        [HttpGet("GetModules")]
        public async Task<IActionResult> GetModules()
        {
            var modules = await _context.Modules.ToListAsync();
            return Ok(modules);
        }

        [HttpGet("GetModule/{id}")]
        public async Task<IActionResult> GetModule(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
                return NotFound(new { Message = $"Module with ID {id} not found." });

            return Ok(module);
        }

        [HttpDelete("DeleteModule/{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            var module = await _context.Modules.FindAsync(id);
            if (module == null)
                return NotFound(new { Message = "Module not found." });

            _context.Modules.Remove(module);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Module deleted successfully." });
        }
    }
}