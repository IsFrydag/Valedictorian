using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TutorSessionsController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public TutorSessionsController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // POST: api/TutorSessions/Record
        [HttpPost("Record")]
        public async Task<IActionResult> RecordSession([FromBody] TutorSessionDto dto)
        {
            if (dto == null || dto.StudentId == 0 || dto.TutorId == 0)
                return BadRequest(new { Message = "StudentId and TutorId are required." });

            var studentExists = await _context.Students.AnyAsync(s => s.StudentId == dto.StudentId);
            var tutorExists = await _context.Tutors.AnyAsync(t => t.TutorId == dto.TutorId);

            if (!studentExists || !tutorExists)
                return NotFound(new { Message = "Invalid Student or Tutor ID." });

            var session = new TutorSession
            {
                StudentId = dto.StudentId,
                TutorId = dto.TutorId,
                StartTime = dto.StartTime ?? DateTime.Now,
                EndTime = dto.EndTime
            };

            _context.TutorSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Session recorded between Student #{dto.StudentId} and Tutor #{dto.TutorId}.",
                dto.StudentId,
                dto.TutorId
            });
        }

        // GET: api/TutorSessions/GetByParticipants/2/5
        [HttpGet("GetByParticipants/{studentId}/{tutorId}")]
        public async Task<IActionResult> GetSessionsByParticipants(int studentId, int tutorId)
        {
            var sessions = await _context.TutorSessions
                .Where(s => s.StudentId == studentId && s.TutorId == tutorId)
                .Select(s => new
                {
                    s.StudentId,
                    s.TutorId,
                    s.StartTime,
                    s.EndTime
                })
                .ToListAsync();

            if (!sessions.Any())
                return Ok(new { Message = "No sessions found between this student and tutor." });

            return Ok(sessions);
        }
    }

    public class TutorSessionDto
    {
        public int StudentId { get; set; }
        public int TutorId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
