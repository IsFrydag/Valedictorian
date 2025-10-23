using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Messages")]
    public class Message
    {
        [Key]
        public int MessageID { get; set; }

        [ForeignKey("Conversation")]
        public int ConversationID { get; set; }

        [ForeignKey("User")]
        public int SenderID { get; set; }

        [Required]
        public string MessageText { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        public virtual Conversation? Conversation { get; set; }
        public virtual UserModel? User { get; set; }

    }
}
