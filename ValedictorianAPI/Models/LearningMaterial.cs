using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class LearningMaterial
{
    public int LearningMaterialId { get; set; }

    public int? ReplyId { get; set; }

    public string? LearningMaterialTitle { get; set; }

    public string? TypeOfLearningMaterial { get; set; }

    public virtual Reply? Reply { get; set; }
}
