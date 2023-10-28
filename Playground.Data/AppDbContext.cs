using Microsoft.EntityFrameworkCore;
using Playground.Models;

namespace Playground.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ToDo> ToDos { get; set; }
}