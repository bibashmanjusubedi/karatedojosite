using Microsoft.Extensions.Configuration;
using System.IO;

namespace backend.DAL;

public static class DatabaseHelper
{
    private static readonly string _connectionString;

    static DatabaseHelper()
    {
        // Build configuration to read appsettings.json
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // adjusts for your execution folder
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public static string ConnectionString => _connectionString;
}
