using DocumentSys.Api.Documents.Models;
using Microsoft.EntityFrameworkCore;

namespace DocumentSys.Persistence.Database;

public class DocumentsDbContext : DbContext
{
    public DbSet<Document> Documents { get; set; }
}