using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    public class TopicSubscription
    {
        [Key]
        public int SubscriptionID { get; set; }

        [Required]
        [ForeignKey(nameof(Topic))]
        public int TopicID { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties (optional but useful)
        public Topic Topic { get; set; }
        public UserModel User { get; set; }
    }
}