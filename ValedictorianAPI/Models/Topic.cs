using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Topic")] // Maps to your SQL table [Topic]
    public class Topic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TopicID { get; set; }

        [Required]
        public int ModuleID { get; set; }

        [Required]
        [StringLength(255)]
        public string TopicTitle { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? TopicDescription { get; set; }
    }
}
