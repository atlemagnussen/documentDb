using System.ComponentModel.DataAnnotations;

namespace DocumentSys.Api.Documents.Models;

public class DocumentDto : DocumentListDto
{
    public string? Content { get; set; }
}

public class DocumentListDto
{
    public required int Id { get; set; }
    
    [MaxLength(255)]
    public required string Title { get; set; }

    [MaxLength(255)]
    public required string Slug { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public required string CreatedByUserId { get; set; }
}

public class DocumentCreateDto
{
    [MaxLength(255)]
    public required string Title { get; set; }
    public string? Content { get; set; }
}

public class DocumentUpdateDto
{
    [MaxLength(255)]
    public required string Title { get; set; }
    public string? Content { get; set; }
}