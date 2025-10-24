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

            // Save the tutoring session
            _context.TutorSessions.Add(dto);
            await _context.SaveChangesAsync();

            // --- AUTO-CONVERSATION LOGIC ---
            var existingConversation = await _context.Conversations.FirstOrDefaultAsync(c =>
                (c.User1ID == dto.StudentID && c.User2ID == dto.TutorID) ||
                (c.User1ID == dto.TutorID && c.User2ID == dto.StudentID)
            );

            if (existingConversation == null)
            {
                var newConversation = new Conversation
                {
                    User1ID = dto.StudentID,
                    User2ID = dto.TutorID,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Conversations.Add(newConversation);
                await _context.SaveChangesAsync();

                // Optional: send an initial welcome message
                var welcomeMessage = new Message
                {
                    ConversationID = newConversation.ConversationID,
                    SenderID = dto.TutorID,
                    MessageText = "Hi, I’ve received your tutoring session request!",
                    SentAt = DateTime.UtcNow,
                    IsRead = false
                };

                _context.Messages.Add(welcomeMessage);
                await _context.SaveChangesAsync();
            }

            // --- 🔔 CREATE NOTIFICATION FOR THE TUTOR ---
            try
            {
                // Get student name for personalization
                var student = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserID == dto.StudentID);

                string studentName = student != null ? $"{student.UserName} {student.UserSurname}" : "A student";

                var notification = new Notification
                {
                    UserID = dto.TutorID,
                    NotificationType = "NewSession",
                    NotificationText = $"{studentName} booked a tutoring session with you for {dto.RequestedDate:dddd, MMM dd yyyy 'at' HH:mm}",
                    NotificationDate = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Notification Error] {ex.Message}");
                // Continue execution; notification failure should not block session creation
            }

            return Ok(new
            {
                Message = "Session created successfully",
                dto.SessionID
            });
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _context.TutorSessions
                .OrderBy(s => s.RequestedDate)
                .ToListAsync();

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
