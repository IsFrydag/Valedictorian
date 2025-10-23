using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ValedictorianAPI.Models
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        public int UserID { get; set; }  // ⚡ No [Column] attribute here

        public string NotificationType { get; set; }
        public string NotificationText { get; set; }
        public DateTime NotificationDate { get; set; }
    }
}