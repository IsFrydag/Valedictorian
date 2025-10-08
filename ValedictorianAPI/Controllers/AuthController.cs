using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Basic validation
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            // Simulate authentication logic
            // In a real app, you'd verify the email and password against a database
            // Extract the first 6 characters of the email as studentNr
            string studentNr = request.Email.Length >= 6 ? request.Email.Substring(0, 6) : request.Email;

            return Ok(new
            {
                message = "Login successful",
                studentNr = studentNr
            });
        }
    }

    // DTO for login request
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}