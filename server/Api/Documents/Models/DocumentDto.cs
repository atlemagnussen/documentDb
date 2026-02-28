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
}