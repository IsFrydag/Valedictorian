using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Conversations")]
    public class Conversation
    {
        [Key]
        public int ConversationID { get; set; }

        [ForeignKey("User1")]
        public int User1ID { get; set; }

        [ForeignKey("User2")]
        public int User2ID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual UserModel User1 { get; set; }
        public virtual UserModel User2 { get; set; }

        public virtual ICollection<Message> Messages { get; set; }
    }
}
