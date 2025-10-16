using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public AuthController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.UserEmail) ||
                string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { Message = "Invalid login credentials." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.UserEmail == dto.UserEmail &&
                u.Password == dto.Password &&
                u.Role == dto.Role
            );

            if (user == null)
                return NotFound(new { Message = $"No such {dto.Role.ToLower()} account found." });

            // Send user data for local storage
            return Ok(new
            {
                user.StudentID,
                user.UserName,
                user.UserSurname,
                user.Role
            });
        }
    }

    public class LoginDto
    {
        public string UserEmail { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // "Student", "Tutor", "Admin"
    }
}