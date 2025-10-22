using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Uploads")]
    public class Upload
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UploadID { get; set; }

        public int? ReplyID { get; set; }

        [Required]
        [StringLength(255)]
        public string UploadFormat { get; set; } = string.Empty;
    }
}