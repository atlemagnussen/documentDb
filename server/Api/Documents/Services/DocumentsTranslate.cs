using System.IO.Compression;
using DocumentSys.Api.Documents.Models;

namespace DocumentSys.Api.Documents.Services;

public static class DocumentsTranslate
{
    public static DocumentDto From(Document doc)
    {
        return new DocumentDto
        {
            Id = doc.Id,
            Title = doc.Title,
            Content = doc.Content
        };
    }

    public static List<DocumentListDto> List(List<Document>? docs)
    {
        if (docs is null)
            return [];

        return [.. docs.Select(d =>
        {
            return new DocumentListDto
            {
                Id = d.Id,
                Title = d.Title
            };
        })];
    }
}
