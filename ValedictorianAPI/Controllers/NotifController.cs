using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotifController : ControllerBase
    {
            [HttpGet("NotificationReceived")]
            public IActionResult NotificationReceived()
            {
                // Example static data
                var Message = new
                {
                    message = "No new Notifications"
                };

                return Ok(Message); // returns JSON { "username": "Andy123", "age": 29 }
            }
        
    }
}
