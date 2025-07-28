using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS engelleme problemi 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Veritabanı bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.UseNetTopologySuite())
);

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IPointRepository, PointRepository>();
builder.Services.AddScoped<ILineRepository, LineRepository>();
builder.Services.AddScoped<IPolygonRepository, PolygonRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();


app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();
app.Run();
