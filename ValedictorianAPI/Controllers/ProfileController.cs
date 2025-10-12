using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public ProfileController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // GET: api/Profile/{id}
        // Fetch a single student's profile
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var student = await _context.Students
                .Where(s => s.StudentId == id)
                .Select(s => new
                {
                    s.StudentId,
                    s.StudentFirstName,
                    s.StudentLastName,
                    s.StudentEmail,
                    s.SubscribedTopic,
                    s.AcademicYear
                })
                .FirstOrDefaultAsync();

            if (student == null)
                return NotFound(new { Message = "Student not found." });

            return Ok(student);
        }

        // POST: api/Profile/SaveProfileInfo
        // Update an existing student's profile
        [HttpPost("SaveProfileInfo")]
        public async Task<IActionResult> SaveProfileInfo([FromBody] ProfileDto profile)
        {
            if (profile == null || string.IsNullOrEmpty(profile.StudentFirstName) || string.IsNullOrEmpty(profile.StudentLastName))
                return BadRequest(new { Message = "Invalid profile data." });

            var student = await _context.Students.FindAsync(profile.StudentId);
            if (student == null)
                return NotFound(new { Message = "Student not found." });

            student.StudentFirstName = profile.StudentFirstName;
            student.StudentLastName = profile.StudentLastName;
            student.StudentEmail = profile.StudentEmail;
            student.SubscribedTopic = profile.SubscribedTopic;
            student.AcademicYear = profile.AcademicYear;

            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Profile updated for {student.StudentFirstName} {student.StudentLastName}" });
        }
    }

    // DTO for profile updates
    public class ProfileDto
    {
        public int StudentId { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string? StudentEmail { get; set; }
        public string? SubscribedTopic { get; set; }
        public int? AcademicYear { get; set; }
    }
}
