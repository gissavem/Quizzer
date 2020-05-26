using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Quizzer
{
    public class Context : IdentityDbContext<User>
    {
        public Context(DbContextOptions options): base(options){}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new RoleConfiguration());         
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Score> Scores { get; set; }
    }
}