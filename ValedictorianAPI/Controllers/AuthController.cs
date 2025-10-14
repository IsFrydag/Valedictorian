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
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.UserEmail) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { Message = "Invalid login credentials." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.UserEmail == dto.UserEmail &&
                u.Password == dto.Password &&
                u.Role == dto.Role
            );

            if (user == null)
                return NotFound(new { Message = $"No {dto.Role} account found with those credentials." });

            return Ok(new
            {
                userID = user.UserID,           // now INT from DB
                userName = user.UserName,
                userSurname = user.UserSurname,
                role = user.Role
            });
        }
    }

    public class LoginDto
    {
        public string UserEmail { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}