using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotivController : ControllerBase
    {
            [HttpGet("NotificationRecived")]
            public IActionResult NotificationRecived()
            {
                // Example static data
                var Message = new
                {
                    Message = "No new Notifications"
                };

                return Ok(Message); // returns JSON { "username": "Andy123", "age": 29 }
            }
        
    }
}
