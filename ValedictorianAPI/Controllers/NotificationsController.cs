using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ValedictorianDbContext _context;
        public NotificationsController(ValedictorianDbContext context)
        {
            _context = context;
        }


        [HttpPost("notifyTopicSubscribers")]
        public async Task<IActionResult> NotifyTopicSubscribers(int topicId, string postAuthor)
        {
            // Get all subscribers for this topic
            var subscribers = await _context.TopicSubscriptions
                .Where(s => s.TopicID == topicId)
                .Select(s => s.UserID)
                .ToListAsync();

            if (!subscribers.Any())
                return Ok(new { Message = "No subscribers to notify." });

            var topic = await _context.Topics.FindAsync(topicId);
            if (topic == null)
                return NotFound(new { Message = "Topic not found." });

            var notifications = subscribers.Select(uid => new Notification
            {
                UserID = uid,
                NotificationType = "NewPost",
                NotificationText = $"New post from {postAuthor} in {topic.TopicTitle}",
                NotificationDate = DateTime.UtcNow
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Notifications sent.", Count = notifications.Count });
        }

        [HttpGet("User/{userId}")]
        public IActionResult GetUserNotifications(int userId)
        {
            var notifications = _context.Notifications
                .Where(n => n.UserID == userId)
                .OrderByDescending(n => n.NotificationDate)
                .ToList();

            return Ok(notifications);
        }
    }
}