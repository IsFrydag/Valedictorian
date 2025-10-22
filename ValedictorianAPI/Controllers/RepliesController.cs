using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
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

        public class ReplyCreateDto
        {
            [Required]
            public int PostID { get; set; }

            [Required]
            public int UserID { get; set; }

            [Required]
            [StringLength(5000)]
            public string Body { get; set; }

            public int? ParentReplyID { get; set; }

            public string? Uploads { get; set; }
            public string? UploadFormat { get; set; }

            public DateTime? CreatedAt { get; set; }
        }

        [HttpPost("AddReply")]
        public async Task<IActionResult> AddReply([FromBody] ReplyCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reply = new Reply
            {
                PostID = dto.PostID,
                UserID = dto.UserID,
                Body = dto.Body,
                ParentReplyID = dto.ParentReplyID,
                Uploads = dto.Uploads,
                UploadFormat = dto.UploadFormat,
                Upvotes = 0,
                CreatedAt = dto.CreatedAt ?? DateTime.UtcNow
            };

            _context.Replies.Add(reply);
            await _context.SaveChangesAsync();

            // Increment post's reply count
            var post = await _context.Posts.FindAsync(dto.PostID);
            if (post != null)
            {
                post.PostReplies = (post.PostReplies ?? 0) + 1;
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "Reply added successfully.", ReplyID = reply.ReplyID });
        }

        [HttpGet("GetRepliesByPost/{postId}")]
        public async Task<IActionResult> GetRepliesByPost(int postId)
        {
            try
            {
                var replies = await _context.Replies
                    .Where(r => r.PostID == postId)
                    .Include(r => r.User)
                    .Select(r => new
                    {
                        r.ReplyID,
                        r.ParentReplyID,
                        r.Body,
                        r.Upvotes,
                        r.CreatedAt,
                        r.Uploads,
                        r.UploadFormat,
                        AuthorName = r.User != null ? r.User.UserName + " " + r.User.UserSurname : "Unknown",
                        AuthorInitials = r.User != null ? (r.User.UserName.Substring(0, 1) + r.User.UserSurname.Substring(0, 1)).ToUpper() : "??"
                    })
                    .OrderByDescending(r => r.CreatedAt) // Newest first
                    .ToListAsync();

                return Ok(replies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }
        }

        [HttpPost("UpvoteReply/{id}")]
        public async Task<IActionResult> UpvoteReply(int id, [FromBody] VoteDto dto)
        {
            var reply = await _context.Replies.FindAsync(id);
            if (reply == null)
                return NotFound(new { Message = "Reply not found" });

            reply.Upvotes += (dto.Direction == "up" ? 1 : -1);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Vote updated", Upvotes = reply.Upvotes });
        }

        public class VoteDto
        {
            [Required]
            public string Direction { get; set; } // "up" or "down"
        }
    }
}