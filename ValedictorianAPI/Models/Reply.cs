using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Reply")]
    public class Reply
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReplyID { get; set; }

        [Required]
        public int PostID { get; set; } // Link to Post

        [Required]
        public int UserID { get; set; }

        [Required]
        [StringLength(5000)]
        public string Body { get; set; } = string.Empty;

        public int? ParentReplyID { get; set; } // For nesting

        public int Upvotes { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Uploads { get; set; }
        public string? UploadFormat { get; set; }

        [ForeignKey("PostID")]
        public virtual Post Post { get; set; }

        [ForeignKey("UserID")]
        public virtual UserModel User { get; set; }

        [ForeignKey("ParentReplyID")]
        public virtual Reply? ParentReply { get; set; }
    }
}