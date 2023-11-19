using Duende.IdentityServer.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
    services.AddDbContext<UserDbContext>(options => { options.UseInMemoryDatabase("Playground.IdentityDatabase"); });

    var isDevelopment = builder.Environment.IsDevelopment();
    services.AddIdentity<IdentityUser, IdentityRole>(options =>
        {
            if (isDevelopment)
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
        .AddEntityFrameworkStores<UserDbContext>()
        .AddDefaultTokenProviders();

    services.ConfigureApplicationCookie(configure =>
    {
        configure.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    });

    var identityServerBuilder = services.AddIdentityServer(options =>
    {
        options.Authentication.CheckSessionCookieSameSiteMode = SameSiteMode.Strict;
    });

    identityServerBuilder.AddAspNetIdentity<IdentityUser>();

    if (isDevelopment)
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

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var userSeeder = new UserSeeder();
    userSeeder.Seed(userManager);
}