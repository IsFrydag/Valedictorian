using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegController : ControllerBase
    {
        [HttpGet("GetRegName")]
        public IActionResult GetRegName()
        {
            // Example static data
            var userData = new
            {
                username = "Piet",
                age = 29
            };

            return Ok(userData); // returns JSON { "username": "Andy123", "age": 29 }
        }
    }
}
