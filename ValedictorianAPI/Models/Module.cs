using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Module
{
    public int ModuleId { get; set; }

    public string? ModuleName { get; set; }

    public string? MaterialUpload { get; set; }

    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
