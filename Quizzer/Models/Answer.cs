using System;

namespace Quizzer
{
    public class Answer
    {
        public Guid Id { get; set; }
        public string PartitionKey { get; set; }
        public Guid QuestionId { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}