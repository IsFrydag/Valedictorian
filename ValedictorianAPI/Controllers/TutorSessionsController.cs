using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TutorSessionsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public TutorSessionsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateSession([FromBody] TutorSession dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.TutorSessions.Add(dto);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Session created", dto.SessionID });
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _context.TutorSessions.ToListAsync();
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionById(int id)
        {
            var session = await _context.TutorSessions.FindAsync(id);
            if (session == null)
                return NotFound(new { Message = "Session not found" });

            return Ok(session);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.TutorSessions.FindAsync(id);
            if (session == null)
                return NotFound();

            _context.TutorSessions.Remove(session);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Session deleted" });
        }
    }
}