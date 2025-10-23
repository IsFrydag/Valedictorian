using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TutorsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public TutorsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        // GET: api/Tutors/All
        [HttpGet("All")]
        public async Task<IActionResult> GetAllTutors()
        {
            var tutors = await _context.Users
                .Where(u => u.Role == "Tutor")
                .Select(u => new
                {
                    userID = u.UserID,
                    fullName = $"{u.UserName} {u.UserSurname}",
                    userEmail = u.UserEmail
                })
                .ToListAsync();

            if (tutors == null || tutors.Count == 0)
                return NotFound(new { Message = "No tutors found" });

            return Ok(tutors);
        }
    }
}
