using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int? TopicId { get; set; }

    public int? StudentId { get; set; }

    public string? PostName { get; set; }

    public string? PostBody { get; set; }

    public string? Status { get; set; }

    public int? PostReplies { get; set; }

    public int? Upvotes { get; set; }

    public bool? DeletedByAdmin { get; set; }

    public bool? EditedByAdmin { get; set; }

    public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();

    public virtual Student? Student { get; set; }

    public virtual Topic? Topic { get; set; }
}
