using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepliesController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public RepliesController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddReply")]
        public async Task<IActionResult> AddReply([FromBody] Reply dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Body))
                return BadRequest(new { Message = "Reply body is required." });

            var reply = new Reply
            {
                UserID = dto.UserID,
                Body = dto.Body,
                Uploads = dto.Uploads,
                UploadFormat = dto.UploadFormat
            };

            _context.Replies.Add(reply);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Reply added successfully.",
                reply.ReplyID
            });
        }

        [HttpGet("GetReplies")]
        public async Task<IActionResult> GetReplies()
        {
            var replies = await _context.Replies.ToListAsync();
            return Ok(replies);
        }

        [HttpGet("GetReply/{id}")]
        public async Task<IActionResult> GetReply(int id)
        {
            var reply = await _context.Replies.FindAsync(id);
            if (reply == null)
                return NotFound(new { Message = $"Reply with ID {id} not found." });

            return Ok(reply);
        }

        [HttpPut("UpdateReply/{id}")]
        public async Task<IActionResult> UpdateReply(int id, [FromBody] Reply dto)
        {
            var reply = await _context.Replies.FindAsync(id);
            if (reply == null)
                return NotFound(new { Message = "Reply not found." });

            reply.UserID = dto.UserID;
            reply.Body = dto.Body;
            reply.Uploads = dto.Uploads;
            reply.UploadFormat = dto.UploadFormat;

            _context.Replies.Update(reply);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Reply updated successfully." });
        }

        [HttpDelete("DeleteReply/{id}")]
        public async Task<IActionResult> DeleteReply(int id)
        {
            var reply = await _context.Replies.FindAsync(id);
            if (reply == null)
                return NotFound(new { Message = "Reply not found." });

            _context.Replies.Remove(reply);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Reply deleted successfully." });
        }
    }
}
