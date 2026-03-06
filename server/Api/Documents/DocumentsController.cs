using DocumentSys.Api.Documents.Models;
using DocumentSys.Api.Documents.Services;
using DocumentSys.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DocumentSys.Api.Documents;

[Authorize(Policies.RequiresAdmin)]
[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly DocumentsService _service;

    public DocumentsController(DocumentsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IEnumerable<DocumentListDto>> List()
    {
        var docs = await _service.List();
        return DocumentsTranslate.List(docs);
    }

    [HttpGet("byid/{id}")]
    public async Task<DocumentDto> Get(int id)
    {
        var doc = await  _service.Get(id);
        return DocumentsTranslate.From(doc);
    }

    [HttpGet("{slug}")]
    public async Task<DocumentDto> GetSlug(string slug)
    {
        var doc = await  _service.GetSlug(slug);
        return DocumentsTranslate.From(doc);
    }

    [HttpPost]
    public async Task<DocumentDto> Create(DocumentCreateDto createDto)
    {
        var userId = User.GetUserId();
        var doc = await _service.Create(createDto, userId);
        return DocumentsTranslate.From(doc);
    }
    
    [HttpPut("{id}")]
    public async Task<DocumentDto> Update(int id, [FromBody] DocumentUpdateDto updateDoc)
    {
        var doc = await  _service.Update(id, updateDoc);
        return DocumentsTranslate.From(doc);
    }
}