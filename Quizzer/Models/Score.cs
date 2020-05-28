using System;

namespace Quizzer
{
    public class Score
    {
        public Guid Id { get; set; }
        public string PartitionKey { get; set; }
        public Guid UserId { get; set; }
        public Difficulty DifficultyLevel { get; set; }
        public int Points { get; set; }
        public DateTime Time { get; set; }
    }
}