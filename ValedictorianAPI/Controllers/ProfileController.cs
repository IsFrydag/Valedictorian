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
                message = "Information saved successfuly"
            };

            return Ok(Message);
        }
    }
}
