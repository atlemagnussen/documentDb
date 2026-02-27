namespace DocumentSys.Api.Documents.Models;

public class DocumentDto
{
    public required string Title { get; set; }
    public string? Content { get; set; }
}