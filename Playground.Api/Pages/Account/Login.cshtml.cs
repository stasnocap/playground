using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Playground.Api.Pages.Account;

public class Login : PageModel
{
    [BindProperty] public LoginForm Form { get; set; }
    
    public void OnGet(string returnUrl)
    {
        Form = new()
        {
            ReturnUrl = returnUrl
        };
    }
    
    public async Task<IActionResult> OnPost(
        [FromServices] SignInManager<IdentityUser> signInManager)
    {
        if (!ModelState.IsValid) 
            return Page();
        
        var signInResult = await signInManager
            .PasswordSignInAsync(Form.UserName, Form.Password, true, false);

        if (signInResult.Succeeded)
        {
            return Redirect(Form.ReturnUrl);
        }

        return Page();
    }

    public class LoginForm
    {
        [Required]
        public string UserName { get; set; }
        
        [Required]
        public string ReturnUrl { get; set; }
        
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}