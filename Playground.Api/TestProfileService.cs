using System.Security.Claims;
using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;

namespace Playground.Api;

public class TestProfileService : IProfileService
{
    public Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var claims = new List<Claim>
        {
            new(IdentityServerConstants.StandardScopes.Profile, "zhopa"),
        };

        context.IssuedClaims.AddRange(claims);

        return Task.CompletedTask;
    }

    public Task IsActiveAsync(IsActiveContext context) => Task.FromResult(true);
}