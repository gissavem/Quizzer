using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Quizzer.Controllers
{
    [ApiController]
    public class QuizController : Controller
    {
        private readonly Context context;
        public QuizController(Context context)
        {
            this.context = context;
        }

        //[Authorize]
        [HttpGet]
        [Route("[controller]/questions/{id}")]
        public async Task<IActionResult> Questions(int id)
        {
            var result = await context.Questions.Where(q => q.Difficulty == (Difficulty)id).ToListAsync();
            foreach (var question in result)
                question.Answers = context.Answers.Where(i => i.QuestionId == question.Id).ToList();
            
            return result.Count() < 1 ? new JsonResult(new { success = false, description = "No questions" }) : new JsonResult(result);
        }

        [HttpGet]
        [Route("[controller]/answers/{id}")]
        public IActionResult Answers(string id)
        {
            var result = context.Answers.Single(a => a.Id.ToString() == id).IsCorrect;
            return new JsonResult(new {IsCorrect = result });
        }
        
        [HttpGet]
        [Route("{controller}/seedDb")]
        public async Task<IActionResult> SeedDb()
        {
            Seed.SeedDb(context);
            return Ok();
        }
    }
}