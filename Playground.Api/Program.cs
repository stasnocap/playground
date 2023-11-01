using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Playground.Api.Form.Validation;
using Playground.Data;

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

app.MapDefaultControllerRoute();

app.UseCors("dev");

app.Run();
