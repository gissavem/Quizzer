using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Quizzer
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> userManager;
        private readonly Context context;
        private readonly SignInManager<User> signInManager;
        private readonly IAntiforgery antiForgery;

        public AccountController(UserManager<User> userManager, Context context, SignInManager<User> signInManager, IAntiforgery antiForgery)
        {
            this.userManager = userManager;
            this.context = context;
            this.signInManager = signInManager;
            this.antiForgery = antiForgery;
        }

        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Login([FromBody]UserLoginModel userModel)
        {
            //var result = signInManager.PasswordSignInAsync(userModel.Email, userModel.Password, false, false).Result;

            var user = await userManager.FindByEmailAsync(userModel.Email);
            if (user != null &&
                await userManager.CheckPasswordAsync(user, userModel.Password))
            {
                var identity = new ClaimsIdentity(IdentityConstants.ApplicationScheme);
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));

                await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme,
                    new ClaimsPrincipal(identity));
            } else
            {
                return BadRequest(new
                {
                    success = false,
                    description = "incorrect username or password"
                });
            }

             //if (!result.Succeeded)

            
            var tokens = antiForgery.GetAndStoreTokens(HttpContext);
            Response.Cookies.Append("XSRF-REQUEST-TOKEN", tokens.RequestToken, new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = false
            });
            
            return Ok();
        }
        
        //[ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
 
            return Ok();
        }
        
        [HttpPost]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Register([FromBody]UserRegistrationModel userModel)
        {
            var user = new User
            {
                UserName = userModel.Email,
                Email = userModel.Email,
                FirstName = userModel.FirstName,
                LastName = userModel.LastName
            };
            var result = await userManager.CreateAsync(user, userModel.Password);

            if(!result.Succeeded)
            {
                return BadRequest(result.Errors.First());
            }
 
            await userManager.AddToRoleAsync(user, "Player");
 
            return Json(new
            {
                success = true,
                description = "User created"
            });
        }
    }
}