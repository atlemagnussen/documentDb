namespace DocumentSys.Api.Documents.Models;

public class Document
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public string? Content { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public required string CreatedByUserId { get; set; }
}