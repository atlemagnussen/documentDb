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

    public async Task<List<Document>> List()
    {
        var docs = await Documents.ToListAsync();
        return docs;
    }

    public async Task<Document> Get(int id)
    {
        var doc = await Documents.FirstOrDefaultAsync(d => d.Id == id) 
            ?? throw new NotFoundException($"{id} not found");
        
        return doc;
    }

    public async Task<Document> Update(int id, DocumentDto dto)
    {
        var doc = await Documents.FirstOrDefaultAsync(d => d.Id == id) 
            ?? throw new NotFoundException($"{id} not found");
        
        doc.Title = dto.Title;
        doc.Content = dto.Content;

        await _context.SaveChangesAsync();
        return doc;
    }
}