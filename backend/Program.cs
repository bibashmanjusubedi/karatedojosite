var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
                .WithOrigins("http://127.0.0.1:5500")   // Add your frontend dev address here
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
