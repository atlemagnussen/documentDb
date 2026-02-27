using Microsoft.AspNetCore.HttpOverrides;
using DocumentSys.Api;
using DocumentSys.Observability;
using DocumentSys.Auth;
using DocumentSys.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.ConfigureOtel()
    .AddOtelExporters();
    
builder.Services.AddProblemDetails(configure =>
{
    configure.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
    };
});
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var authServer = Environment.GetEnvironmentVariable("AUTH_SERVER") ?? "https://id.logout.work";

builder.AddAuthentication(authServer);
builder.AddPersistence();
builder.AddApi();

builder.Services.AddRazorPages();

var app = builder.Build();

// must be first
app.UseForwardedHeaders();

app.UseHttpsRedirection();
app.UseFileServer();
//app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHsts();
}
app.UseExceptionHandler();

app.MapControllers();

app.Run();
