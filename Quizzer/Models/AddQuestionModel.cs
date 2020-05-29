using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzer
{
    public class AddQuestionModel
    {
        public string QuestionText { get; set; }
        public List<string> Answers { get; set; }
        public string CorrectId { get; set; }
    }
}
