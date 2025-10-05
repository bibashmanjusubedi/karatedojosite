using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class ProgramsCreateUpdateDto
    {
        public int? Id { get; set; } // optional, for update
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
        public string Pricing { get; set; }
    }
}
