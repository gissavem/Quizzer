using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Quizzer
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> userManager;
        private readonly Context context;

        public AccountController(UserManager<User> userManager, Context context)
        {
            this.userManager = userManager;
            this.context = context;
        }
        [HttpGet]
        public IActionResult Register()
        {
            return Ok();
        }
 
        [HttpPost]
        public async Task<IActionResult> Register([FromBody]UserRegistrationModel userModel)
        {

            context.Database.EnsureCreated();
            context.Lolboxes.Add(new MyModel{Lolbox = "lol"});
            context.SaveChanges();
            var user = new User
            {
                UserName = userModel.Email,
                Email = userModel.Email,
                FirstName = userModel.FirstName,
                LastName = userModel.LastName
            };
            IdentityResult result;
            try
            {

                 result = await userManager.CreateAsync(user, userModel.Password);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
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