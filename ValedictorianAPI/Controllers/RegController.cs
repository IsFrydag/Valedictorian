using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public RegController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("RegisterUser")]
        public async Task<IActionResult> RegisterUser( UserModel dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.UserName) ||
                string.IsNullOrWhiteSpace(dto.UserSurname) ||
                string.IsNullOrWhiteSpace(dto.UserEmail) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.Role))
            {
                return BadRequest(new { Message = "All fields are required." });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == dto.UserEmail);
            if (existingUser!=null)
                return Conflict(new { Message = "A user with this email already exists." });

            string userId = dto.UserEmail.Length >= 6 ? dto.UserEmail.Substring(0, 6) : dto.UserEmail;


            var user = new UserModel
            {
                StudentID = userId,
                UserName = dto.UserName,
                UserSurname = dto.UserSurname,
                UserEmail = dto.UserEmail,
                Password = dto.Password,
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"User {user.UserName} {user.UserSurname} registered as {user.Role}.",
                user.StudentID
            });
        }
    }

}