using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public TopicsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddTopic")]
        public async Task<IActionResult> AddTopic([FromBody] Topic dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.TopicTitle))
                return BadRequest(new { Message = "TopicTitle is required." });

            var topic = new Topic
            {
                ModuleID = dto.ModuleID,
                TopicTitle = dto.TopicTitle,
                TopicDescription = dto.TopicDescription
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Topic added successfully.",
                topic.TopicID
            });
        }

        [HttpGet("GetTopics")]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _context.Topics.ToListAsync();
            return Ok(topics);
        }

        [HttpGet("GetTopic/{id}")]
        public async Task<IActionResult> GetTopic(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound(new { Message = $"Topic with ID {id} not found." });

            return Ok(topic);
        }

        [HttpPut("UpdateTopic/{id}")]
        public async Task<IActionResult> UpdateTopic(int id, [FromBody] Topic dto)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound(new { Message = "Topic not found." });

            topic.ModuleID = dto.ModuleID;
            topic.TopicTitle = dto.TopicTitle;
            topic.TopicDescription = dto.TopicDescription;

            _context.Topics.Update(topic);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Topic updated successfully." });
        }

        [HttpDelete("DeleteTopic/{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound(new { Message = "Topic not found." });

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Topic deleted successfully." });
        }

        [HttpPost("Subscribe/{topicId}")]
        public async Task<IActionResult> Subscribe(int topicId, [FromQuery] int userId)
        {
            var sub = new TopicSubscription { TopicID = topicId, UserID = userId };
            _context.TopicSubscriptions.Add(sub);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Subscribed successfully" });
        }

        [HttpDelete("Unsubscribe/{topicId}")]
        public async Task<IActionResult> Unsubscribe(int topicId, [FromQuery] int userId)
        {
            var sub = await _context.TopicSubscriptions
                .FirstOrDefaultAsync(s => s.TopicID == topicId && s.UserID == userId);
            if (sub == null) return NotFound(new { message = "Subscription not found" });

            _context.TopicSubscriptions.Remove(sub);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Unsubscribed successfully" });
        }

        [HttpGet("IsSubscribed/{topicId}")]
        public async Task<IActionResult> IsSubscribed(int topicId, [FromQuery] int userId)
        {
            bool isSub = await _context.TopicSubscriptions
                .AnyAsync(s => s.TopicID == topicId && s.UserID == userId);
            return Ok(new { subscribed = isSub });
        }
    }
}