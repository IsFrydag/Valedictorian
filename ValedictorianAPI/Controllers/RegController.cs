using Microsoft.AspNetCore.Mvc;

namespace ValedictorianAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegController : ControllerBase
    {
        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // Basic validation
            if (request == null || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Surname) ||
                string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) ||
                string.IsNullOrEmpty(request.UserType))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            // Validate email domain based on userType
            string expectedDomain = request.UserType.ToLower() switch
            {
                "student" => "@student.belgiumcampus.ac.za",
                "tutor" => "@tutor.belgiumcampus.ac.za",
                "admin" => "@admin.belgiumcampus.ac.za",
                _ => null
            };

            if (expectedDomain == null || !request.Email.EndsWith(expectedDomain, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "Invalid email domain for the selected user type" });
            }

            // Simulate processing (e.g., saving to a database)
            // In a real app, you'd hash the password and save the user to a database

            // Return a response with name and surname
            return Ok(new
            {
                message = "Registration successful",
                name = request.Name,
                surname = request.Surname
            });
        }
    }

    // DTO for registration request
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; }
    }
}