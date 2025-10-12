using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Tutor
{
    public int TutorId { get; set; }

    public int? StudentId { get; set; }

    public string? TutorName { get; set; }

    public decimal? TutorRate { get; set; }

    public string? TutorReviews { get; set; }

    public string? ModulesApprovedFor { get; set; }

    public string TutorPassword { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<PrivateMessaging> PrivateMessagings { get; set; } = new List<PrivateMessaging>();

    public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();

    public virtual Student? Student { get; set; }

    public virtual ICollection<TutorSession> TutorSessions { get; set; } = new List<TutorSession>();
}
