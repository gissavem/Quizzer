using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Quizzer.Controllers
{
    public class ScoreController : Controller
    {
        private readonly UserManager<User> userManager;
        private readonly Context context;

        public ScoreController(UserManager<User> userManager, Context context)
        {
            this.userManager = userManager;
            this.context = context;
        }
        [HttpPost]
        [Authorize]
        [Route("score")]
        public async Task<IActionResult> Score([FromBody]ScoreModel scoreModel)
        {
            var score = new Score
            {
                UserId = Guid.Parse(userManager.GetUserAsync(User).Result.Id),
                DifficultyLevel = (Difficulty)scoreModel.Difficulty,
                Points = scoreModel.Score,
                Time = DateTime.Now,
                Id = Guid.NewGuid()
            };
            context.Scores.Add(score);
            await context.SaveChangesAsync();
            return Ok();
        }
        [HttpGet]
        [Authorize]
        [Route("score")]
        public IActionResult Score()
        {
            var query = from score in context.Scores.ToList()
                join user in context.Users.ToList() on score.UserId.ToString() equals user.Id
                select new
                {
                    userName = $"{user.FirstName} {user.LastName}",
                    score = score.Points,
                    time = score.Time,
                    difficulty = score.DifficultyLevel.ToString()

                };

            return new JsonResult(query.ToList());
        }
    }
}