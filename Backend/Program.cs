using Microsoft.EntityFrameworkCore;
using TravelApp.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("*"));
});

builder.Services.AddControllers();

// Add SQLite database connection
builder.Services.AddDbContext<TravelappContext>(opt =>
     opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Comment out HTTPS redirection for development
// app.UseHttpsRedirection();

// Use CORS before Authorization
app.UseCors("AllowAngularDev");

app.UseAuthorization();

app.MapControllers();

app.Run();

