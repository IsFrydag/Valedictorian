using System;
using System.Collections.Generic;

namespace ValedictorianAPI.Models;

public partial class Admin
{
    public int AdminId { get; set; }

    public string AdminName { get; set; } = null!;

    public string AdminSurname { get; set; } = null!;

    public string AdminEmail { get; set; } = null!;

    public string AdminPassword { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();
}
