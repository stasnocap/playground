using Microsoft.AspNetCore.Identity;

namespace Playground.Data.Seeders;

public class UserSeeder
{
    public void Seed(UserManager<IdentityUser> userManager)
    {
        var user = new IdentityUser("test");
        userManager.CreateAsync(user, "password").GetAwaiter().GetResult();
    }
}