namespace DocumentSys.Api.Documents.Models;

public class Document
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Content { get; set; }
}