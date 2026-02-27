using System.IO.Compression;
using DocumentSys.Api.Documents.Models;
using DocumentSys.Extensions;
using DocumentSys.Persistence.Database;
using Microsoft.EntityFrameworkCore;

namespace DocumentSys.Api.Documents.Services;

public class DocumentsService
{
    private readonly DocumentsDbContext _context;
    public DocumentsService(DocumentsDbContext context)
    {
        _context = context;
    }

    private IQueryable<Document> Documents => _context.Documents;

    public async Task<IEnumerable<Document>> List()
    {
        var docs = await Documents.ToArrayAsync();
        return docs;
    }

    public async Task<Document> Get(int id)
    {
        var doc = await Documents.FirstOrDefaultAsync(d => d.Id == id) 
            ?? throw new NotFoundException($"{id} not found");
        
        return doc;
    }
}