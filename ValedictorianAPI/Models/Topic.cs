using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Topic
{
    public int TopicId { get; set; }

    public int? ModuleId { get; set; }

    public int? AdminId { get; set; }

    public string? TopicTitle { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual Module? Module { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
