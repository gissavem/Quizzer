﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace Quizzer
{
    public static class Seed
    {
        static HttpClient client = new HttpClient();
        static string baseUrl = "https://opentdb.com/api.php?amount=50&type=multiple";

        public static async Task<string> GetJsonString()
        {
            HttpResponseMessage response = await client.GetAsync(baseUrl);
            var content = await response.Content.ReadAsStringAsync();
            content = content.Replace("&#039;", "");
            content = content.Replace("&quot;", "");
            return content;
        }

        public static void SeedDb(Context context, UserManager<User> userManager)
        {
            var user = new User
            {
                FirstName = "Admin",
                LastName = "Admin",
                UserName = "admin1@admin.com",
                Email = "admin1@admin.com"
            };
            var createResult = userManager.CreateAsync(user, "Admin12345!").Result;
            var roleResult = userManager.AddToRoleAsync(user, "Admin").Result;

            for (int i = 0; i < 5; i++)
            {
                var questions = JsonConvert.DeserializeObject<SeedResponse>(GetJsonString().Result).Results;
                foreach (var question in questions)
                {
                    List<Answer> answers = new List<Answer>();
                    Question newQuestion = new Question();

                    newQuestion.Id = Guid.NewGuid();
                    newQuestion.Text = question.question;
                    newQuestion.Difficulty = (Difficulty)Enum.Parse(typeof(Difficulty), char.ToUpper(question.difficulty[0]) + question.difficulty.Substring(1));
                    answers.Add(new Answer
                    {
                        Id = Guid.NewGuid(),
                        QuestionId = newQuestion.Id,
                        IsCorrect = true,
                        Text = question.correct_answer
                    });
                    foreach (var answer in question.incorrect_answers)
                    {
                        answers.Add(new Answer
                        {
                            Id = Guid.NewGuid(),
                            IsCorrect = false,
                            QuestionId = newQuestion.Id,
                            Text = answer
                        });
                    }
                    context.Questions.Add(newQuestion);
                    foreach (var answer in answers)
                    {
                        context.Answers.Add(answer);
                    }
                }
                context.SaveChanges();
            }
        }

    }
}
