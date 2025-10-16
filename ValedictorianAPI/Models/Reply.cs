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
        public int UserID { get; set; }

        [Required]
        public string Body { get; set; } = string.Empty;

        // Optional fields
        public string? Uploads { get; set; }
        public string? UploadFormat { get; set; }
    }
}