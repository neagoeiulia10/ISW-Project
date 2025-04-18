using Microsoft.EntityFrameworkCore;
namespace TravelApp.Models;
public class TravelappContext : DbContext
{
    public TravelappContext(DbContextOptions<TravelappContext> options) : base(options)
    {

    }
    public DbSet<TravelappItem> TravelappItems { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
}

