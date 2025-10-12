using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Student
{
    public int StudentId { get; set; }

    public string? StudentFirstName { get; set; }

    public string? StudentLastName { get; set; }

    public string? StudentEmail { get; set; }

    public string? SubscribedTopic { get; set; }

    public int? AcademicYear { get; set; }

    public string StudentPassword { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<PrivateMessaging> PrivateMessagings { get; set; } = new List<PrivateMessaging>();

    public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();

    public virtual ICollection<TutorSession> TutorSessions { get; set; } = new List<TutorSession>();

    public virtual ICollection<Tutor> Tutors { get; set; } = new List<Tutor>();

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
}
