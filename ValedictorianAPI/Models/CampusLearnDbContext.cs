using Microsoft.EntityFrameworkCore;

namespace ValedictorianAPI.Models
{
    public class ValedictorianDbContext : DbContext
    {
        public ValedictorianDbContext(DbContextOptions<ValedictorianDbContext> options) : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<TutorSession> TutorSessions { get; set; }
        public DbSet<Upload> Uploads { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<TopicSubscription> TopicSubscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().ToTable("User"); 
            modelBuilder.Entity<Upload>().ToTable("Uploads"); 
            modelBuilder.Entity<TutorSession>().ToTable("TutorSessions");
            modelBuilder.Entity<Topic>().ToTable("Topic");
            modelBuilder.Entity<Reply>().ToTable("Reply");
            modelBuilder.Entity<Post>().ToTable("Post");
            modelBuilder.Entity<Notification>().ToTable("Notifications");
            modelBuilder.Entity<Module>().ToTable("Module");

            modelBuilder.Entity<TopicSubscription>()
                .HasOne(ts => ts.Topic)
                .WithMany(t => t.Subscriptions)
                .HasForeignKey(ts => ts.TopicID);

            modelBuilder.Entity<TopicSubscription>()
                .HasOne(ts => ts.User)
                .WithMany()
                .HasForeignKey(ts => ts.UserID);


            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}