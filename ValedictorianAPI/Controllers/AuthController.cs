using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public AuthController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // Example: GET /api/Auth/GetLoginName
        [HttpGet("GetLoginName")]
        public async Task<IActionResult> GetLoginName()
        {
            var users = await _context.Admins
                .Select(a => new { a.AdminId, a.AdminName, a.AdminSurname })
                .ToListAsync();

            if (users == null || !users.Any())
                return NotFound(new { Message = "No users found." });

            return Ok(users);
        }
    }
}
