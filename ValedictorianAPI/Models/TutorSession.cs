using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class TutorSession
{
    public int StudentId { get; set; }

    public int TutorId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Tutor Tutor { get; set; } = null!;
}
