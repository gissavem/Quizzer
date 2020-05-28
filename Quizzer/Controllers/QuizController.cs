using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Quizzer.Controllers
{
    [ApiController]
    public class QuizController : Controller
    {
        private readonly Context context;
        private readonly UserManager<User> userManager;

        public QuizController(Context context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        //[Authorize]
        [HttpGet]
        [Route("[controller]/questions/{id}")]
        public async Task<IActionResult> Questions(int id)
        {
            var result = context.Questions.Where(q => q.Difficulty == (Difficulty)id).ToList().OrderBy(x => Guid.NewGuid()).Take(15).ToList();
            foreach (var question in result)
                question.Answers = context.Answers.ToList().Where(i => i.QuestionId == question.Id).ToList();
            
            return !result.Any() ? new JsonResult(new { success = false, description = "No questions" }) : new JsonResult(result);
        }

        [HttpGet]
        [Route("[controller]/questions/")]
        public async Task<IActionResult> Questions()
        {
            var result = await context.Questions.ToListAsync();
            foreach (var question in result)
                question.Answers = context.Answers.ToList().Where(i => i.QuestionId == question.Id).ToList();

            return !result.Any() ? new JsonResult(new { success = false, description = "No questions" }) : new JsonResult(result);
        }

        [HttpDelete]
        [Route("[controller]/questions/{id}")]
        public IActionResult Questions(string id)
        {
            Question result = null;
            try
            {
                result = context.Questions.ToList().Single(q => q.Id.ToString() == id);
                context.Questions.Remove(result);
                context.SaveChanges();
                return Ok("Successfully removed question.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("[controller]/questions/{id}")]
        public IActionResult EditQuestion(string id, [FromBody]UpdateQuestionModel model)
        {
            var question = context.Questions.ToList().Single(q => q.Id.ToString() == id);
            question.Text = model.QuestionText;
            foreach (var answer in model.Answers
                .Where(answer => answer.Id.ToString() == model.CorrectId))
            {
                answer.IsCorrect = true;
            }
            
            question.Answers = model.Answers;
            context.Questions.Update(question);
            context.SaveChanges();
            
            return new JsonResult( new
            {
                success = true,
                description = "question updated"
            });
        }

        [HttpGet]
        [Route("[controller]/answers/{id}")]
        public IActionResult Answers(string id)
        {
            var result = context.Answers.ToList().Single(a => a.Id.ToString() == id);

            if (result.IsCorrect)
            {
                return new JsonResult(new
                {
                    IsCorrect = result.IsCorrect,
                    CorrectAnswer = result.Id
                });
                
            }
            return new JsonResult(new
            {
                IsCorrect = result.IsCorrect,
                CorrectAnswer = context.Answers.Single(a => a.QuestionId == result.QuestionId && a.IsCorrect).Id
            });
            
        }
        
        [HttpGet]
        [Route("{controller}/seedDb")]
        public async Task<IActionResult> SeedDb()
        {
            Seed.SeedDb(context, userManager);
            return Ok();
        }
    }
}