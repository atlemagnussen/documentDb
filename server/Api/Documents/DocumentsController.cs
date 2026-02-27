using DocumentSys.Api.Documents.Models;
using DocumentSys.Api.Documents.Services;
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
    public async Task<IEnumerable<DocumentDto>> List()
    {
        var docs = await _service.List();
        return [.. docs.Select(d => DocumentsTranslate.From(d))];
    }

    [HttpGet("{id}")]
    public async Task<DocumentDto> Get(int id)
    {
        var doc = await  _service.Get(id);
        return DocumentsTranslate.From(doc);
    }
}