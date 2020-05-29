﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Quizzer.Controllers
{
    [ApiController]
    public class QuizController : Controller
    {
        //new {Success = false, StatusCode = 400, Error = "Bad Request", Message = "Id is less than 0" }
        private readonly Context context;
        private readonly UserManager<User> userManager;

        public QuizController(Context context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        [Route("api/questions/{id}")]
        public IActionResult GetQuestions(int id)
        {
            if (id < 0)
                return new BadRequestObjectResult(new {Success = false, StatusCode = 400, Error = "Bad Request", Message = "Id is less than 0" });      

            try
            {
                var result = context.Questions.Where(q => q.Difficulty == (Difficulty)id).ToList().OrderBy(x => Guid.NewGuid()).Take(15).ToList();
                foreach (var question in result)
                    question.Answers = context.Answers.ToList().Where(i => i.QuestionId == question.Id).ToList();

                if (!result.Any())
                    return new NotFoundObjectResult(new { Success = false, StatusCode = 404, Error = "Not Found", Message = "No questions" });

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new {Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }         
        }

        [Authorize]
        [HttpGet]
        [Route("api/questions")]
        public async Task<IActionResult> GetAllQuestions()
        {
            if(!User.IsInRole("Admin"))
                return Unauthorized(new { Success = false, StatusCode = 401, Error = "Unauthorized", Message = "Unauthorized request" });
            
            var result = await context.Questions.ToListAsync();

            if (!result.Any())
                return new NotFoundObjectResult(new { Success = false, StatusCode = 404, Error = "Not Found", Message = "No questions" });

            foreach (var question in result)
                question.Answers = context.Answers.ToList().Where(i => i.QuestionId == question.Id).ToList();

            return new OkObjectResult(result);
        }
        
        [Authorize]
        [HttpPost]
        [Route("api/questions")]
        public IActionResult InsertQuestion([FromBody]AddQuestionModel model)
        {
            if (!User.IsInRole("Admin"))
                return Unauthorized(new { Success = false, StatusCode = 401, Error = "Unauthorized", Message = "Unauthorized request" });

            try
            {
                var answers = new List<Answer>();
                var question = new Question {Id = Guid.NewGuid(), Text = model.QuestionText, Difficulty = Difficulty.Easy };

                for (int i = 0; i < 4; i++)
                    answers.Add(new Answer {Id = Guid.NewGuid(), QuestionId = question.Id, Text = model.Answers[i] });
                
                answers[int.Parse(model.CorrectId)].IsCorrect = true;
                question.Answers = answers;

                context.Questions.Add(question);
                context.Answers.AddRange(answers);
                context.SaveChanges();

                return new OkObjectResult(new { Success = true, StatusCode = 200, Error = "", Message = "Created and inserted question to database." });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("api/questions/{id}")]
        public IActionResult DeleteQuestion(string id)
        {
            if (!User.IsInRole("Admin"))
                return Unauthorized(new { Success = false, StatusCode = 401, Error = "Unauthorized", Message = "Unauthorized request" });

            try
            {
                var result = context.Questions.ToList().Single(q => q.Id.ToString() == id);
                context.Questions.Remove(result);
                context.SaveChanges();
                return new OkObjectResult(new { Success = true, StatusCode = 200, Error = "", Message = "Successfully removed question from database"});
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("api/questions/{id}")]
        public IActionResult EditQuestion(string id, [FromBody]UpdateQuestionModel model)
        {
            if (!User.IsInRole("Admin"))
                return Unauthorized(new { Success = false, StatusCode = 401, Error = "Unauthorized", Message = "Unauthorized request" });

            try
            {
                var question = context.Questions.ToList().Single(q => q.Id.ToString() == id);
                question.Text = model.QuestionText;

                foreach (var answer in model.Answers.Where(answer => answer.Id.ToString() == model.CorrectId))
                    answer.IsCorrect = true;
                
                question.Answers = model.Answers;
                context.Questions.Update(question);
                context.SaveChanges();

                return new OkObjectResult(new { Success = true, StatusCode = 200, Error = "", Message = "Successfully updated question in database" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        [Route("api/answers/{id}")]
        public IActionResult GetCorrectAnswer(string id)
        {
            try
            {
                var result = context.Answers.ToList().Single(a => a.Id.ToString() == id);
                if (result.IsCorrect)
                    return new JsonResult(new { IsCorrect = result.IsCorrect, CorrectAnswer = result.Id });

                return new JsonResult(new { IsCorrect = result.IsCorrect, CorrectAnswer = context.Answers.Single(a => a.QuestionId == result.QuestionId && a.IsCorrect).Id });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Success = false, StatusCode = 400, Error = "Bad Request", Message = ex.Message });
            }
            
        }

        [HttpGet]
        [Route("api/seedDb")]
        public async Task<IActionResult> SeedDb()
        {
            Seed.SeedDb(context, userManager);
            return Ok("Seeded database");
        }
    }
}