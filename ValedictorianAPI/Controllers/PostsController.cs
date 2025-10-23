using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using ValedictorianAPI.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public PostsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        public class PostCreateDto
        {
            [Required]
            public int TopicID { get; set; }

            [Required]
            public int UserID { get; set; }

            [Required]
            [StringLength(500)]
            public string PostName { get; set; }

            [Required]
            public string PostBody { get; set; }

            public string? Status { get; set; }

            public int PostReplies { get; set; }

            public int? Upvotes { get; set; }

            public DateTime? CreatedAt { get; set; }
        }

        [HttpPost("AddPost")]
        public async Task<IActionResult> AddPost([FromBody] PostCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var post = new Post
            {
                TopicID = dto.TopicID,
                UserID = dto.UserID,
                PostName = dto.PostName,
                PostBody = dto.PostBody,
                Status = dto.Status,
                PostReplies = dto.PostReplies,
                Upvotes = dto.Upvotes ?? 0,
                CreatedAt = dto.CreatedAt ?? DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // ✅ Get the author's name
            var author = await _context.Users
                .Where(u => u.UserID == dto.UserID)
                .Select(u => u.UserName + " " + u.UserSurname)
                .FirstOrDefaultAsync();

            // ✅ Find all topic subscribers except the author
            var subscribers = await _context.TopicSubscriptions
                .Where(s => s.TopicID == dto.TopicID && s.UserID != dto.UserID)
                .Select(s => s.UserID)
                .ToListAsync();

            if (subscribers.Any())
            {
                var topic = await _context.Topics.FindAsync(dto.TopicID);
                if (topic != null)
                {
                    var notifications = subscribers.Select(uid => new Notification
                    {
                        UserID = uid,
                        NotificationType = "NewPost",
                        NotificationText = $"New post from {author} in topic '{topic.TopicTitle}'",
                        NotificationDate = DateTime.UtcNow
                    }).ToList();

                    _context.Notifications.AddRange(notifications);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new
            {
                Message = "Post added successfully and notifications sent.",
                post.PostID,
                post.CreatedAt
            });
        }

        [HttpGet("GetPosts")]
        public async Task<IActionResult> GetPosts()
        {
            try
            {
                var posts = await _context.Posts
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        p.PostID,
                        p.TopicID,
                        p.PostName,
                        p.PostBody,
                        p.Status,
                        p.PostReplies,
                        p.Upvotes,
                        p.CreatedAt,
                        AuthorName = p.User != null
                            ? p.User.UserName + " " + p.User.UserSurname
                            : "Unknown",
                        AuthorInitials = p.User != null
                            ? (p.User.UserName.Substring(0, 1) + p.User.UserSurname.Substring(0, 1)).ToUpper()
                            : "??"
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }
        }

        [HttpGet("GetPostsByTopic/{id}")]
        public async Task<IActionResult> GetPostsByTopic(int id)
        {
            try
            {
                var posts = await _context.Posts
                    .Where(p => p.TopicID == id)
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        p.PostID,
                        p.TopicID,
                        p.PostName,
                        p.PostBody,
                        p.Status,
                        p.PostReplies,
                        p.Upvotes,
                        p.CreatedAt,
                        AuthorName = p.User != null
                            ? p.User.UserName + " " + p.User.UserSurname
                            : "Unknown",
                        AuthorInitials = p.User != null
                            ? (p.User.UserName.Substring(0, 1) + p.User.UserSurname.Substring(0, 1)).ToUpper()
                            : "??"
                    })
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }
        }

        [HttpGet("GetPost/{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var post = await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Topic)
                    .Where(p => p.PostID == id)
                    .Select(p => new
                    {
                        p.PostID,
                        p.TopicID,
                        p.PostName,
                        p.PostBody,
                        p.Status,
                        p.PostReplies,
                        p.Upvotes,
                        p.CreatedAt,
                        AuthorName = p.User != null
                            ? p.User.UserName + " " + p.User.UserSurname
                            : "Unknown",
                        AuthorInitials = p.User != null
                            ? (p.User.UserName.Substring(0, 1) + p.User.UserSurname.Substring(0, 1)).ToUpper()
                            : "??",
                        TopicTitle = p.Topic != null ? p.Topic.TopicTitle : "Unknown"
                    })
                    .FirstOrDefaultAsync();

                if (post == null)
                    return NotFound(new { Message = "Post not found" });

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }
        }

        [HttpPost("UpvotePost/{id}")]
        public async Task<IActionResult> UpvotePost(int id, [FromBody] VoteRequest request)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { Message = "Post not found." });

            if (request.Direction == "down")
                post.Upvotes = (post.Upvotes ?? 0) - 1;
            else
                post.Upvotes = (post.Upvotes ?? 0) + 1;

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return Ok(new { post.PostID, post.Upvotes });
        }

        public class VoteRequest
        {
            public string Direction { get; set; }
        }


        [HttpDelete("DeletePost/{id}")]
        public async Task<IActionResult> DeletePost(int id, [FromQuery] int userId)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);
                if (post == null)
                    return NotFound(new { message = "Post not found" });

                // Check ownership
                if (post.UserID != userId)
                    return Unauthorized(new { message = "You can only delete your own posts" });

                // Remove replies (optional, if you have them)
                var replies = _context.Replies.Where(r => r.PostID == id);
                _context.Replies.RemoveRange(replies);

                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting post: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting post." });
            }
        }


    }
}