using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpGet("GetLoginName")]
        public IActionResult GetLoginName()
        {
            // Example static data
            var userData = new
            {
                username = "Andy123",
                age = 29
            };

            return Ok(userData); // returns JSON { "username": "Andy123", "age": 29 }
        }
    }
}
