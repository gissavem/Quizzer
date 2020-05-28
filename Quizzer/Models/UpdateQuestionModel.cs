using System.Collections.Generic;

namespace Quizzer
{
    public class UpdateQuestionModel
    {
        public string QuestionId { get; set; }
        public string QuestionText { get; set; }
        public List<Answer> Answers { get; set; }
        public string CorrectId { get; set; }
        
    }
}