using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200", // Angular
                "http://127.0.0.1:5500"  // Local test client
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Configure EF Core with SQL Server
builder.Services.AddDbContext<ValedictorianDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ValedictorianDB"))
);

// Build the app
var app = builder.Build();

// Enable CORS before routing
app.UseCors("MyCorsPolicy");

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
