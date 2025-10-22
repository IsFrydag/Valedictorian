using Microsoft.EntityFrameworkCore;

namespace ValedictorianAPI.Models
{
    public class ValedictorianDbContext : DbContext
    {
        public ValedictorianDbContext(DbContextOptions<ValedictorianDbContext> options): base(options)
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User"); // Maps to SQL table [User]
            modelBuilder.Entity<Upload>().ToTable("Uploads"); // Maps to SQL table [Uploads]
            modelBuilder.Entity<TutorSession>().ToTable("TutorSessions"); // Maps to SQL table [TutorSession]
            modelBuilder.Entity<Topic>().ToTable("Topic"); // Maps to SQL table [TutorSession]
            modelBuilder.Entity<Reply>().ToTable("Reply"); // Maps to SQL table [Reply]
            modelBuilder.Entity<Post>().ToTable("Post"); // Maps to SQL table [Post]
            modelBuilder.Entity<Notification>().ToTable("Notifications"); // Maps to SQL table [Notification] 
            modelBuilder.Entity<Module>().ToTable("Module"); // Maps to SQL table [Module]

        }
    }
}