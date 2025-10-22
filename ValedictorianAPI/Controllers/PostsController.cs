using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using ValedictorianAPI.Models;

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

            // Optional: allows frontend to send a custom timestamp, otherwise backend sets it
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
                CreatedAt = dto.CreatedAt ?? DateTime.UtcNow // set automatically if not provided
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Post added successfully.",
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
    }
}