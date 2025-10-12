using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class PrivateMessaging
{
    public int? StudentId { get; set; }

    public int? TutorId { get; set; }

    public int ConversationId { get; set; }

    public string? PrivateMessage { get; set; }

    public DateTime? DateTime { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Tutor? Tutor { get; set; }
}
