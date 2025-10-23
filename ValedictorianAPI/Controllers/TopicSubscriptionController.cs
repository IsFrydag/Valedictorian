using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopicSubscriptionsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;

        public TopicSubscriptionsController(ValedictorianDbContext context)
        {
            _context = context;
        }

        // POST api/TopicSubscriptions/Subscribe
        // Body: { "topicId": 1, "userId": 2 }
        [HttpPost("Subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
        {
            if (dto == null || dto.TopicId <= 0 || dto.UserId <= 0)
                return BadRequest(new { Message = "Invalid topicId or userId." });

            // Verify topic exists
            var topic = await _context.Topics.FindAsync(dto.TopicId);
            if (topic == null) return NotFound(new { Message = "Topic not found." });

            // Check already subscribed
            var exists = await _context.TopicSubscriptions.AnyAsync(s => s.TopicID == dto.TopicId && s.UserID == dto.UserId);
            if (exists) return BadRequest(new { Message = "Already subscribed." });

            var sub = new TopicSubscription
            {
                TopicID = dto.TopicId,
                UserID = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.TopicSubscriptions.Add(sub);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Subscribed", SubscriptionID = sub.SubscriptionID });
        }

        // DELETE api/TopicSubscriptions/Unsubscribe?topicId=1&userId=2
        [HttpDelete("Unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromQuery] int topicId, [FromQuery] int userId)
        {
            if (topicId <= 0 || userId <= 0) return BadRequest(new { Message = "Invalid topicId or userId." });

            var sub = await _context.TopicSubscriptions.FirstOrDefaultAsync(s => s.TopicID == topicId && s.UserID == userId);
            if (sub == null) return NotFound(new { Message = "Subscription not found." });

            _context.TopicSubscriptions.Remove(sub);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Unsubscribed" });
        }

        // GET api/TopicSubscriptions/IsSubscribed?topicId=1&userId=2
        [HttpGet("IsSubscribed")]
        public async Task<IActionResult> IsSubscribed([FromQuery] int topicId, [FromQuery] int userId)
        {
            if (topicId <= 0 || userId <= 0) return BadRequest(new { Message = "Invalid topicId or userId." });

            var exists = await _context.TopicSubscriptions.AnyAsync(s => s.TopicID == topicId && s.UserID == userId);
            return Ok(new { Subscribed = exists });
        }

        // Optionally: GET api/TopicSubscriptions/GetSubscribersCount/1
        [HttpGet("GetSubscribersCount/{topicId}")]
        public async Task<IActionResult> GetSubscribersCount(int topicId)
        {
            var count = await _context.TopicSubscriptions.CountAsync(s => s.TopicID == topicId);
            return Ok(new { Count = count });
        }

        public class SubscribeDto
        {
            public int TopicId { get; set; }
            public int UserId { get; set; }
        }

        [HttpGet("GetUserSubscriptions/{userId}")]
        public async Task<IActionResult> GetUserSubscriptions(int userId)
        {
            var subscriptions = await _context.TopicSubscriptions
                .Include(ts => ts.Topic) 
                .Where(ts => ts.UserID == userId)
                .Select(ts => new
                {
                    ts.SubscriptionID,
                    ts.TopicID,
                    TopicTitle = ts.Topic.TopicTitle,
                    ts.CreatedAt
                })
                .ToListAsync();

            return Ok(subscriptions);
        }
    }
}
