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
        [Route("api/score")]
        public async Task<IActionResult> Score([FromBody]ScoreModel scoreModel)
        {
            try
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
                return Ok(new { Success = true, StatusCode = 200, Error = "", Message = "Successfully added score to database" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        [Route("api/score")]
        public IActionResult Score()
        {
            try
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
                var queryToList = query.ToList();

                if (!queryToList.Any())
                    return Ok(new { Success = true, StatusCode = 200, Error = "", Message = "No scores currently in database" });

                return Ok(query.ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }
    }
}