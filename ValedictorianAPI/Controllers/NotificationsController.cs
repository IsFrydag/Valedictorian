using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
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

        [HttpPost("add")]
        public async Task<IActionResult> AddNotification([FromBody] Notification dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.NotificationText) ||
                string.IsNullOrWhiteSpace(dto.NotificationType))
            {
                return BadRequest(new { Message = "All fields are required." });
            }

            var notification = new Notification
            {
                NotificationText = dto.NotificationText,
                NotificationType = dto.NotificationType,
                NotificationDate = dto.NotificationDate
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Notification added successfully.",
                notification.NotificationID
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notifications = await _context.Notifications.ToListAsync();
            return Ok(notifications);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var notif = await _context.Notifications.FindAsync(id);
            if (notif == null)
                return NotFound(new { Message = "Notification not found." });

            return Ok(notif);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var notif = await _context.Notifications.FindAsync(id);
            if (notif == null)
                return NotFound(new { Message = "Notification not found." });

            _context.Notifications.Remove(notif);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Notification deleted successfully." });
        }
    }
}