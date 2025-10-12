using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Reply
{
    public int ReplyId { get; set; }

    public int? PostId { get; set; }

    public int? StudentId { get; set; }

    public int? TutorId { get; set; }

    public string? Body { get; set; }

    public string? LearningMaterial { get; set; }

    public string? TypeOfLearningMaterial { get; set; }

    public virtual ICollection<LearningMaterial> LearningMaterials { get; set; } = new List<LearningMaterial>();

    public virtual Post? Post { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Tutor? Tutor { get; set; }
}
