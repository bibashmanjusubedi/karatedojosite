namespace backend.Models
{
    public class AdminUpdateDto
    {
        public string CurrentUsername { get; set; } = string.Empty;
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewUsername { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
