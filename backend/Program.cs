using backend.DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// JWT Authentication config (ADD THIS HERE)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // only for dev/test!
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "myIssuer",           // must match token generation
        ValidAudience = "myAudience",       // must match token generation
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("my_super_secure_long_secret_key_123456"))
    };
});





var app = builder.Build();

app.UseHttpsRedirection();


// ADD THIS: Enable CORS (should be above MapControllers)
app.UseCors("AllowFrontend");  // Use the policy you named abov

// ADD THESE:
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "Hello World!");

app.Run();
