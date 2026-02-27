using DocumentSys.Api.Documents.Models;

namespace DocumentSys.Api.Documents.Services;

public static class DocumentsTranslate
{
    public static DocumentDto From(Document doc)
    {
        return new DocumentDto
        {
            Title = doc.Title,
            Content = doc.Content
        };
    }
}
