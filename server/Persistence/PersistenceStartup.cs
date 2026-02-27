using DocumentSys.Persistence.Database;

namespace DocumentSys.Persistence;

public static class PersistenceStartup
{
    public static void AddPersistence(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetDbConnectionString();
        builder.AddDatabase(connectionString);
    }

    public static string GetDbConnectionString(this IConfiguration configuration)
    {
        var connectionString = configuration.GetValue<string>("ConnectionStrings:DocumentDb");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ApplicationException("no connection string!!!");
        return connectionString;
    }
}