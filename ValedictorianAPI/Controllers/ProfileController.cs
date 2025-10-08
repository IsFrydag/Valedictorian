using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        [HttpGet("SaveProfileInfo")]
        public IActionResult SaveProfileInfo()
        {
            // Example static data
            var Message = new
            {
                Message = "Piet"
            };

            return Ok(Message); // returns JSON { "username": "Andy123", "age": 29 }
        }
    }
}
