using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Post")] // Maps to SQL table [Post]
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PostID { get; set; }

        [Required]
        public int TopicID { get; set; }

        [Required]
        public int UserID { get; set; } // Foreign key to UserModel

        [Required]
        public string PostName { get; set; } = string.Empty;

        [Required]
        public string PostBody { get; set; } = string.Empty;

        public string? Status { get; set; } // "solved" or null/"unsolved"

        public int? PostReplies { get; set; } // Could change to int if counting replies

        public int? Upvotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Added for timing

        // Navigation property to UserModel
        [ForeignKey(nameof(UserID))]
        public virtual UserModel User { get; set; } // Virtual for lazy loading if enabled
    }
}