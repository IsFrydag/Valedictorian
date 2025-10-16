using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Module")] // Maps to SQL table [Module]
    public class Module
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModuleID { get; set; }

        [Required]
        [StringLength(200)]
        public string ModuleName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ModuleDescription { get; set; }

        [StringLength(255)]
        public string? UploadedMaterial { get; set; }
    }
}