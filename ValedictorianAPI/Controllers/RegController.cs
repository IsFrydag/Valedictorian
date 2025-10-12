using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public RegController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // ==========================
        // STUDENT REGISTRATION
        // ==========================
        [HttpPost("RegisterStudent")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.StudentFirstName) ||
                string.IsNullOrWhiteSpace(dto.StudentLastName) ||
                string.IsNullOrWhiteSpace(dto.StudentEmail) ||
                string.IsNullOrWhiteSpace(dto.StudentPassword))
            {
                return BadRequest(new { Message = "All required student fields must be provided." });
            }

            var emailExists = await _context.Students.AnyAsync(s => s.StudentEmail == dto.StudentEmail);
            if (emailExists)
                return Conflict(new { Message = "A student with this email already exists." });

            var student = new Student
            {
                StudentFirstName = dto.StudentFirstName,
                StudentLastName = dto.StudentLastName,
                StudentEmail = dto.StudentEmail,
                StudentPassword = dto.StudentPassword,
                AcademicYear = dto.AcademicYear,
                SubscribedTopic = dto.SubscribedTopic
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Student {student.StudentFirstName} {student.StudentLastName} registered successfully.",
                student.StudentId
            });
        }

        // ==========================
        // TUTOR REGISTRATION
        // ==========================
        [HttpPost("RegisterTutor")]
        public async Task<IActionResult> RegisterTutor([FromBody] RegisterTutorDto dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.TutorName) ||
                string.IsNullOrWhiteSpace(dto.TutorPassword))
            {
                return BadRequest(new { Message = "All required tutor fields must be provided." });
            }

            // Optional email-based check if your tutor table has unique identifiers
            if (!string.IsNullOrWhiteSpace(dto.StudentEmail))
            {
                var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentEmail == dto.StudentEmail);
                if (student == null)
                    return NotFound(new { Message = "Linked student not found." });

                dto.StudentId = student.StudentId;
            }

            var tutor = new Tutor
            {
                TutorName = dto.TutorName,
                TutorPassword = dto.TutorPassword,
                TutorRate = dto.TutorRate,
                TutorReviews = dto.TutorReviews,
                ModulesApprovedFor = dto.ModulesApprovedFor,
                StudentId = dto.StudentId
            };

            _context.Tutors.Add(tutor);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Tutor {tutor.TutorName} registered successfully.",
                tutor.TutorId
            });
        }

        // ==========================
        // GET ALL REGISTERED STUDENTS
        // ==========================
        [HttpGet("GetStudents")]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students
                .Select(s => new
                {
                    s.StudentId,
                    s.StudentFirstName,
                    s.StudentLastName,
                    s.StudentEmail,
                    s.AcademicYear
                })
                .ToListAsync();

            if (students == null || students.Count == 0)
                return Ok(new { Message = "No students found." });

            return Ok(students);
        }

        // ==========================
        // GET ALL REGISTERED TUTORS
        // ==========================
        [HttpGet("GetTutors")]
        public async Task<IActionResult> GetTutors()
        {
            var tutors = await _context.Tutors
                .Select(t => new
                {
                    t.TutorId,
                    t.TutorName,
                    t.TutorRate,
                    t.TutorReviews,
                    t.ModulesApprovedFor,
                    t.StudentId
                })
                .ToListAsync();

            if (tutors == null || tutors.Count == 0)
                return Ok(new { Message = "No tutors found." });

            return Ok(tutors);
        }
    }

    // ==========================
    // DTOs
    // ==========================
    public class RegisterStudentDto
    {
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string StudentEmail { get; set; }
        public string StudentPassword { get; set; }
        public int? AcademicYear { get; set; }
        public string? SubscribedTopic { get; set; }
    }

    public class RegisterTutorDto
    {
        public string TutorName { get; set; }
        public string TutorPassword { get; set; }
        public decimal? TutorRate { get; set; }
        public string? TutorReviews { get; set; }
        public string? ModulesApprovedFor { get; set; }
        public int? StudentId { get; set; } // optional link to student
        public string? StudentEmail { get; set; } // for lookup convenience
    }
}
