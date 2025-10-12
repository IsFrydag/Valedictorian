namespace ValedictorianAPI.Models
{
    public class AuthBLL
    {
        public bool ValidateCredentials(string username, string password)
        {
            // Example: Replace with DB check
            return username == "Andy123" && password == "password123";
        }
    }
}
