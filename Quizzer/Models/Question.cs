using System;
using System.Collections.Generic;

namespace Quizzer
{
    public class Question
    {
        public Guid Id { get; set; }
        public string PartitionKey { get; set; }
        public string Text { get; set; }
        public virtual List<Answer> Answers { get; set; } = new List<Answer>();
        public Difficulty Difficulty { get; set; }
    }
}
