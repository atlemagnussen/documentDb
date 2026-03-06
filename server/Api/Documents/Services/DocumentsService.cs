using System.IO.Compression;
using System.Text.RegularExpressions;
using DocumentSys.Api.Documents.Models;
using DocumentSys.Extensions;
using DocumentSys.Persistence.Database;
using Microsoft.EntityFrameworkCore;

namespace DocumentSys.Api.Documents.Services;

public class DocumentsService
{
    private const int MaxSlugLength = 255;
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

    public async Task<Document> GetSlug(string slug)
    {
        var doc = await Documents.FirstOrDefaultAsync(d => d.Slug == slug) 
            ?? throw new NotFoundException($"{slug} not found");
        
        return doc;
    }

    public async Task<Document> Update(int id, DocumentUpdateDto dto)
    {
        var doc = await Documents.FirstOrDefaultAsync(d => d.Id == id) 
            ?? throw new NotFoundException($"{id} not found");
        
        doc.Title = dto.Title;
        doc.Slug = await BuildUniqueSlug(dto.Title, id);
        doc.Content = dto.Content;

        await _context.SaveChangesAsync();
        return doc;
    }

    public async Task<Document> Create(DocumentCreateDto create, string createdByUserId)
    {
        var doc = new Document
        {
            Title = create.Title,
            Slug = await BuildUniqueSlug(create.Title),
            Content = create.Content,
            CreatedByUserId = createdByUserId
        };

        await _context.Documents.AddAsync(doc);
        await _context.SaveChangesAsync();
        return doc;
    }

    private async Task<string> BuildUniqueSlug(string title, int? excludeDocumentId = null)
    {
        var baseSlug = ToSlug(title);
        if (baseSlug.Length > MaxSlugLength)
            baseSlug = baseSlug[..MaxSlugLength];

        var candidate = baseSlug;
        var suffix = 1;

        while (await Documents.AnyAsync(d =>
                   d.Slug == candidate &&
                   (!excludeDocumentId.HasValue || d.Id != excludeDocumentId.Value)))
        {
            suffix++;
            var suffixText = $"-{suffix}";
            var prefixLength = Math.Max(1, MaxSlugLength - suffixText.Length);
            var prefix = baseSlug.Length <= prefixLength ? baseSlug : baseSlug[..prefixLength];
            candidate = $"{prefix}{suffixText}";
        }

        return candidate;
    }

    private static string ToSlug(string title)
    {
        var value = title.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(value))
            return "document";

        value = Regex.Replace(value, "[^a-z0-9\\s-]", "");
        value = Regex.Replace(value, "\\s+", "-");
        value = Regex.Replace(value, "-+", "-").Trim('-');

        return string.IsNullOrWhiteSpace(value) ? "document" : value;
    }
}