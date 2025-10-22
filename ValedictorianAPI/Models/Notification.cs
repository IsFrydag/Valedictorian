using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NotificationID { get; set; }

        [Required]
        public string NotificationText { get; set; } = string.Empty;

        [Required]
        public string NotificationType { get; set; } = string.Empty;

        [Required]
        public DateTime NotificationDate { get; set; }
    }
}
