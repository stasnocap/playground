using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Playground.Api.Form.Validation;
using Playground.Data;
using Playground.Data.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(x =>
{
    x.AddPolicy("dev", policyBuilder => policyBuilder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin());
});

builder.Services
    .AddFluentValidationAutoValidation()
    .AddValidatorsFromAssemblyContaining<CreateToDoFormValidation>();

builder.Services.AddDbContext<AppDbContext>(x =>
{
    x.UseInMemoryDatabase("Playground.Database");
});

var app = builder.Build();

Seed(app.Services);

app.MapDefaultControllerRoute();

app.UseCors("dev");

app.Run();

static void Seed(IServiceProvider serviceProvider)
{
    using var scope = serviceProvider.CreateScope();
    var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    var todoSeeder = new TodoSeeder();
    todoSeeder.Seed(appDbContext);
}