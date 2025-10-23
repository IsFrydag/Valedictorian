using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public MessagesController(ValedictorianDbContext context)
        {
            _context = context;
        }

        // Get all messages for a conversation
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationID == conversationId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // Send a message
        [HttpPost("Send")]
        public async Task<IActionResult> SendMessage([FromBody] Message msg)
        {
            ModelState.Remove("Conversation");
            ModelState.Remove("User");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            msg.SentAt = DateTime.UtcNow;
            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();
            return Ok(msg);
        }


        // Get user conversations
        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetConversations(int userId)
        {
            var conversations = await _context.Conversations
                .Include(c => c.User1)
                .Include(c => c.User2)
                .Where(c => c.User1ID == userId || c.User2ID == userId)
                .ToListAsync();

            return Ok(conversations);
        }

        [HttpPost("NewConversation")]
        public async Task<IActionResult> CreateConversation([FromBody] Conversation newConv)
        {
            if (newConv == null || newConv.User1ID == 0 || newConv.User2ID == 0)
                return BadRequest(new { Message = "Invalid participants" });

            newConv.CreatedAt = DateTime.UtcNow;
            _context.Conversations.Add(newConv);
            await _context.SaveChangesAsync();

            return Ok(newConv);
        }

    }
}
