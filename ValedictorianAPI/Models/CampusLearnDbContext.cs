using Microsoft.EntityFrameworkCore;

namespace ValedictorianAPI.Models
{
    public class ValedictorianDbContext : DbContext
    {
        public ValedictorianDbContext(DbContextOptions<ValedictorianDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().ToTable("User"); // map to your DB table
        }
    }
}