using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? StudentId { get; set; }

    public int? TutorId { get; set; }

    public int? AdminId { get; set; }

    public string? Notification1 { get; set; }

    public string? NotificationType { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Tutor? Tutor { get; set; }
}
