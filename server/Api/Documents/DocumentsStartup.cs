using DocumentSys.Api.Documents.Services;

namespace DocumentSys.Api.Documents;

public static class DocumentsStartup
{
    public static void AddDocuments(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<DocumentsService>();
    }
}