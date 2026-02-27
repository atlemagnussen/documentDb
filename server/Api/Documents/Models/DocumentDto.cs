using System.ComponentModel.DataAnnotations;

namespace DocumentSys.Api.Documents.Models;

public class DocumentDto
{
    [MaxLength(255)]
    public required string Title { get; set; }
    public string? Content { get; set; }
}