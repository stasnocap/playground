using Duende.IdentityServer.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Playground.Api;
using Playground.Api.Form.Validation;
using Playground.Data;
using Playground.Data.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddRazorPages();

AddIdentity(builder.Services);

const string devCors = "dev";

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

builder.Services.AddDbContext<AppDbContext>(x => { x.UseInMemoryDatabase("Playground.Database"); });

var app = builder.Build();

Seed(app.Services);

app.UseCors(devCors);

app.UseAuthentication();

app.UseIdentityServer();

app.MapDefaultControllerRoute();
app.MapRazorPages();

app.Run();

void AddIdentity(IServiceCollection services)
{
    services.AddDbContext<IdentityDbContext>();

    services.AddIdentity<IdentityUser, IdentityRole>(options =>
        {
            if (app!.Environment.IsDevelopment())
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            }
            else
            {
                // todo configure for production
            }
        })
        .AddEntityFrameworkStores<IdentityDbContext>();

    var identityServerBuilder = services.AddIdentityServer();

    identityServerBuilder.AddAspNetIdentity<IdentityUser>();

    if (app!.Environment.IsDevelopment())
    {
        identityServerBuilder.AddInMemoryIdentityResources(new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        });

        identityServerBuilder.AddInMemoryClients(new[]
        {
            new Client
            {
                ClientId = "web-client",
                AllowedGrantTypes = GrantTypes.Code,
                
                RedirectUris = new[] { "http://localhost:3000" },
                PostLogoutRedirectUris = new[] { "http://localhost:3000" },
                AllowedCorsOrigins = new[] { "http://localhost:3000" },
                
                RequirePkce = true,
                AllowAccessTokensViaBrowser = true,
                RequireConsent = false,
                RequireClientSecret = false,
            }
        });

        identityServerBuilder.AddDeveloperSigningCredential();
    }
}

void Seed(IServiceProvider serviceProvider)
{
    using var scope = serviceProvider.CreateScope();
    var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var todoSeeder = new TodoSeeder();
    todoSeeder.Seed(appDbContext);
}