using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotifController : ControllerBase
    {
        private readonly CampusLearnDbContext _context;

        public NotifController(CampusLearnDbContext context)
        {
            _context = context;
        }

        // GET: api/Notif/Notifications
        [HttpGet("Notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.Notifications
                .Select(n => new
                {
                    n.NotificationId,
                    n.Notification1,       // message text
                    n.NotificationType,
                    n.StudentId,
                    n.TutorId,
                    n.AdminId
                })
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
                return Ok(new { Message = "No new notifications" });

            return Ok(notifications);
        }
    }
}
