using Microsoft.EntityFrameworkCore;
using ValedictorianAPI.Models; // <-- Add this to access CampusLearnDBContext

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
<<<<<<< HEAD
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:5500") // Angular app URL
              .AllowAnyMethod()  // GET, POST, PUT, DELETE
              .AllowAnyHeader(); // Any headers
=======
        policy.WithOrigins(
                "http://localhost:4200", // Angular
                "http://localhost:5500"  // Local test client
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
>>>>>>> API-update
    });
});

// Configure EF Core with SQL Server
builder.Services.AddDbContext<CampusLearnDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CampusLearnDB"))
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
