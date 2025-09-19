namespace backend.Models
{
    public class Dojo
    {
        public int Id { get; set; }                  // id INTEGER PRIMARY KEY AUTOINCREMENT
        public string Name { get; set; }             // name TEXT
        public string HeroTitle { get; set; }        // hero_title TEXT
        public string HeroSubtitle { get; set; }     // hero_subtitle TEXT
        public string HeroImageURL { get; set; }     // hero_image_url TEXT
        public string EstablishedDate { get; set; }  // established_date TEXT
        public string Description { get; set; }      // description TEXT
    }
}
