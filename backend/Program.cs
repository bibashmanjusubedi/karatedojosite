using backend.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Get connection string from configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// Register repositories with Dependency Injection
// Scoped: One instance per HTTP request
builder.Services.AddScoped<IDojoRepository>(provider =>
    new DojoRepository(connectionString));

builder.Services.AddScoped<AdminRepository>(provider =>
    new AdminRepository(connectionString));


builder.Services.AddControllers(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
                .WithOrigins("http://127.0.0.1:5500", "http://localhost:8080", "http://127.0.0.1:8080")   // Add your frontend dev address here
                .AllowAnyHeader()
                .AllowAnyMethod()
    );
});

var app = builder.Build();

app.UseHttpsRedirection();


// ADD THIS: Enable CORS (should be above MapControllers)
app.UseCors("AllowFrontend");  // Use the policy you named abov

app.MapControllers();
app.MapGet("/", () => "Hello World!");

app.Run();
