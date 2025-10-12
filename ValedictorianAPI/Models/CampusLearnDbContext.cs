using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ValedictorianAPI.Models;

public partial class CampusLearnDbContext : DbContext
{
    public CampusLearnDbContext()
    {
    }

    public CampusLearnDbContext(DbContextOptions<CampusLearnDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<LearningMaterial> LearningMaterials { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<PrivateMessaging> PrivateMessagings { get; set; }

    public virtual DbSet<Reply> Replies { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<Topic> Topics { get; set; }

    public virtual DbSet<Tutor> Tutors { get; set; }

    public virtual DbSet<TutorSession> TutorSessions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LIAM_PC;Database=CampusLearnDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE4E86E8B35CC");

            entity.ToTable("Admin", "AdministrativeOversight");

            entity.Property(e => e.AdminId)
                .ValueGeneratedNever()
                .HasColumnName("AdminID");
            entity.Property(e => e.AdminEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AdminName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AdminPassword)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AdminSurname)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LearningMaterial>(entity =>
        {
            entity.HasKey(e => e.LearningMaterialId).HasName("PK__Learning__524DCCD4E39E3F5B");

            entity.ToTable("LearningMaterial", "LearningContent");

            entity.Property(e => e.LearningMaterialId)
                .ValueGeneratedNever()
                .HasColumnName("LearningMaterialID");
            entity.Property(e => e.LearningMaterialTitle)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ReplyId).HasColumnName("ReplyID");
            entity.Property(e => e.TypeOfLearningMaterial)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Reply).WithMany(p => p.LearningMaterials)
                .HasForeignKey(d => d.ReplyId)
                .HasConstraintName("FK__LearningM__Reply__5812160E");
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.HasKey(e => e.ModuleId).HasName("PK__Module__2B7477871FDD729B");

            entity.ToTable("Module", "LearningContent");

            entity.Property(e => e.ModuleId)
                .ValueGeneratedNever()
                .HasColumnName("ModuleID");
            entity.Property(e => e.MaterialUpload).HasMaxLength(255);
            entity.Property(e => e.ModuleName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E3267244F2B");

            entity.ToTable("Notification", "AdministrativeOversight");

            entity.Property(e => e.NotificationId)
                .ValueGeneratedNever()
                .HasColumnName("NotificationID");
            entity.Property(e => e.AdminId).HasColumnName("AdminID");
            entity.Property(e => e.Notification1)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Notification");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TutorId).HasColumnName("TutorID");

            entity.HasOne(d => d.Admin).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.AdminId)
                .HasConstraintName("FK_Notificat_Admin");

            entity.HasOne(d => d.Student).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Notificat__Stude__5AEE82B9");

            entity.HasOne(d => d.Tutor).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.TutorId)
                .HasConstraintName("FK__Notificat__Tutor__5BE2A6F2");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Post__AA126038C9662468");

            entity.ToTable("Post", "DiscussionInteraction");

            entity.Property(e => e.PostId)
                .ValueGeneratedNever()
                .HasColumnName("PostID");
            entity.Property(e => e.PostBody).IsUnicode(false);
            entity.Property(e => e.PostName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TopicId).HasColumnName("TopicID");

            entity.HasOne(d => d.Student).WithMany(p => p.Posts)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Post__StudentID__45F365D3");

            entity.HasOne(d => d.Topic).WithMany(p => p.Posts)
                .HasForeignKey(d => d.TopicId)
                .HasConstraintName("FK__Post__TopicID__44FF419A");
        });

        modelBuilder.Entity<PrivateMessaging>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__PrivateM__C050D897F7961024");

            entity.ToTable("PrivateMessaging", "Communication");

            entity.Property(e => e.ConversationId)
                .ValueGeneratedNever()
                .HasColumnName("ConversationID");
            entity.Property(e => e.DateTime).HasColumnType("datetime");
            entity.Property(e => e.PrivateMessage).IsUnicode(false);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TutorId).HasColumnName("TutorID");

            entity.HasOne(d => d.Student).WithMany(p => p.PrivateMessagings)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__PrivateMe__Stude__4F7CD00D");

            entity.HasOne(d => d.Tutor).WithMany(p => p.PrivateMessagings)
                .HasForeignKey(d => d.TutorId)
                .HasConstraintName("FK__PrivateMe__Tutor__5070F446");
        });

        modelBuilder.Entity<Reply>(entity =>
        {
            entity.HasKey(e => e.ReplyId).HasName("PK__Replies__C25E46293A0429C7");

            entity.ToTable("Replies", "DiscussionInteraction");

            entity.Property(e => e.ReplyId)
                .ValueGeneratedNever()
                .HasColumnName("ReplyID");
            entity.Property(e => e.Body).IsUnicode(false);
            entity.Property(e => e.LearningMaterial).IsUnicode(false);
            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TutorId).HasColumnName("TutorID");
            entity.Property(e => e.TypeOfLearningMaterial)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Post).WithMany(p => p.Replies)
                .HasForeignKey(d => d.PostId)
                .HasConstraintName("FK__Replies__PostID__534D60F1");

            entity.HasOne(d => d.Student).WithMany(p => p.Replies)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Replies__Student__5441852A");

            entity.HasOne(d => d.Tutor).WithMany(p => p.Replies)
                .HasForeignKey(d => d.TutorId)
                .HasConstraintName("FK__Replies__TutorID__5535A963");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52A79A0A76255");

            entity.ToTable("Student", "StudentManagement");

            entity.Property(e => e.StudentId)
                .ValueGeneratedNever()
                .HasColumnName("StudentID");
            entity.Property(e => e.StudentEmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.StudentFirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentLastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentPassword)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("TempPass123!");
            entity.Property(e => e.SubscribedTopic)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasMany(d => d.Modules).WithMany(p => p.Students)
                .UsingEntity<Dictionary<string, object>>(
                    "StudentModule",
                    r => r.HasOne<Module>().WithMany()
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__StudentMo__Modul__3C69FB99"),
                    l => l.HasOne<Student>().WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__StudentMo__Stude__3B75D760"),
                    j =>
                    {
                        j.HasKey("StudentId", "ModuleId").HasName("PK__StudentM__50726D01DD0A1ADB");
                        j.ToTable("StudentModule", "StudentManagement");
                        j.IndexerProperty<int>("StudentId").HasColumnName("StudentID");
                        j.IndexerProperty<int>("ModuleId").HasColumnName("ModuleID");
                    });
        });

        modelBuilder.Entity<Topic>(entity =>
        {
            entity.HasKey(e => e.TopicId).HasName("PK__Topic__022E0F7D258AE708");

            entity.ToTable("Topic", "LearningContent");

            entity.Property(e => e.TopicId)
                .ValueGeneratedNever()
                .HasColumnName("TopicID");
            entity.Property(e => e.AdminId).HasColumnName("AdminID");
            entity.Property(e => e.ModuleId).HasColumnName("ModuleID");
            entity.Property(e => e.TopicTitle).HasMaxLength(100);

            entity.HasOne(d => d.Admin).WithMany(p => p.Topics)
                .HasForeignKey(d => d.AdminId)
                .HasConstraintName("FK_Topic_AdminID");

            entity.HasOne(d => d.Module).WithMany(p => p.Topics)
                .HasForeignKey(d => d.ModuleId)
                .HasConstraintName("FK__Topic__ModuleID__412EB0B6");
        });

        modelBuilder.Entity<Tutor>(entity =>
        {
            entity.HasKey(e => e.TutorId).HasName("PK__Tutor__77C70FC23EB13516");

            entity.ToTable("Tutor", "TutoringSupport");

            entity.Property(e => e.TutorId)
                .ValueGeneratedNever()
                .HasColumnName("TutorID");
            entity.Property(e => e.ModulesApprovedFor).HasMaxLength(255);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TutorName).HasMaxLength(100);
            entity.Property(e => e.TutorPassword)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("TempPass123!");
            entity.Property(e => e.TutorRate).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Student).WithMany(p => p.Tutors)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Tutor__StudentID__48CFD27E");
        });

        modelBuilder.Entity<TutorSession>(entity =>
        {
            entity.HasKey(e => new { e.StudentId, e.TutorId }).HasName("PK__TutorSes__05B95A85754995A8");

            entity.ToTable("TutorSessions", "TutoringSupport");

            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.TutorId).HasColumnName("TutorID");
            entity.Property(e => e.EndTime).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasColumnType("datetime");

            entity.HasOne(d => d.Student).WithMany(p => p.TutorSessions)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TutorSess__Stude__4BAC3F29");

            entity.HasOne(d => d.Tutor).WithMany(p => p.TutorSessions)
                .HasForeignKey(d => d.TutorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TutorSess__Tutor__4CA06362");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
