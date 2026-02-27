using DocumentSys.Api.Documents.Models;
using Microsoft.EntityFrameworkCore;

namespace DocumentSys.Persistence.Database;

public class DocumentsDbContext : DbContext
{
    public DocumentsDbContext(DbContextOptions<DocumentsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Document> Documents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.Content).HasColumnType("text");
        });
    }
}