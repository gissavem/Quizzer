using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzer
{
    public class SeedResponse
    {
        public int ResponseCode { get; set; }
        public IEnumerable<SeedQuestion> Results { get; set; }

    }
}
