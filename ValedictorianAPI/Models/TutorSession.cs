using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("TutorSessions")]
    public class TutorSession
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SessionID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [Required]
        public int TutorID { get; set; }

        [Required]
        public int ModuleID { get; set; }

        [Required]
        [StringLength(50)]
        public string TutorType { get; set; } = string.Empty;

        [Required]
        public DateTime RequestedDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending";
    }


}