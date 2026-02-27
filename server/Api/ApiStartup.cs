using System.Text.Json;
using System.Text.Json.Serialization;
using DocumentSys.Api.Documents;

namespace DocumentSys.Api;

public static class ApiStartup
{
    public static void AddApi(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(allowIntegerValues: false));
        });

        builder.AddDocuments();

        builder.Services.AddOpenApi(options =>
            options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_1
        );
    }
}