using Microsoft.EntityFrameworkCore;

namespace DocumentSys.Persistence.Database;

public static class DatabaseStartup
{
    public static void AddDatabase(this WebApplicationBuilder builder, string connectionString)
    {
        builder.Services.AddDbContext<DocumentsDbContext>(opt =>
        {
            opt.UseNpgsql(connectionString, o =>
            {
                o.ConfigureDataSource(ds => ds.EnableDynamicJson());
            });
        });
    }
}