using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpPost("AddPost")]
        public async Task<IActionResult> AddPost([FromBody] Post dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.PostName) || string.IsNullOrWhiteSpace(dto.PostBody))
                return BadRequest(new { Message = "Post name and body are required." });

            var post = new Post
            {
                TopicID = dto.TopicID,
                PostName = dto.PostName,
                PostBody = dto.PostBody,
                Status = dto.Status,
                PostReplies = dto.PostReplies,
                Upvotes = dto.Upvotes ?? 0
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Post added successfully.",
                post.PostID
            });
        }

        [HttpGet("GetPosts")]
        public async Task<IActionResult> GetPosts()
        {
            var posts = await _context.Posts.ToListAsync();
            return Ok(posts);
        }

        [HttpGet("GetPost/{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { Message = $"Post with ID {id} not found." });

            return Ok(post);
        }

        [HttpPut("UpdatePost/{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post dto)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { Message = "Post not found." });

            post.TopicID = dto.TopicID;
            post.PostName = dto.PostName;
            post.PostBody = dto.PostBody;
            post.Status = dto.Status;
            post.PostReplies = dto.PostReplies;
            post.Upvotes = dto.Upvotes;

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Post updated successfully." });
        }

        [HttpDelete("DeletePost/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { Message = "Post not found." });

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Post deleted successfully." });
        }
    }
}
