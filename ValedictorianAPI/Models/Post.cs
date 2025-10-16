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
        public string PostName { get; set; } = string.Empty;

        [Required]
        public string PostBody { get; set; } = string.Empty;

        public string? Status { get; set; }
        public string? PostReplies { get; set; }
        public int? Upvotes { get; set; }
    }
}