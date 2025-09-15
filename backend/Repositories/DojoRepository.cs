using System;
using System.Collections.Generic;
using System.Data.SQLite;

public class DojoRepository
{
    private readonly string _connectionString;
    public DojoRepository(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public IEnumerable<Dojo> GetAllDojos()
    {
        var Dojos = new List<Dojo>();
        using var(conn = new SQLiteConnection(_connectionString)
        {
            conn.Open();
            using (var cmd = new SQLiteCommand("SELECT *  FROM Dojo",conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    var Dojo = new Dojo
                    {
                        Id = Convert.ToInt32(reader["Id"]);
                        Name = reader["Name"]?.ToString();
                        HeroTitle = reader["hero_title"]?.ToString();
                        HeroSubtitle = reader["hero_subtitle"]?.ToString();
                        HeroImageURL = reader["hero_image_url"]?.ToString();
                        EstablishedDate = reader["established_date"]?.ToString();
                        Description = reader["description"]?.TOString();
                    };
                    Dojos.Add(Dojo);
                }

            }
            return Dojos;
        }

    }
}