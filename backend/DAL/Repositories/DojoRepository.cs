using System;
using System.Collections.Generic;
using backend.Models;
// using System.Data.SQLite;
using Microsoft.Data.Sqlite;
using backend.DAL;
namespace backend.DAL.Repositories;
public class DojoRepository
{
    private readonly string _connectionString;
    public DojoRepository()
    {
        _connectionString = DatabaseHelper.ConnectionString;
    }

    public IEnumerable<Dojo> GetAllDojos()
    {
        var Dojos = new List<Dojo>();
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        using (var cmd = new SqliteCommand("SELECT * FROM Dojo", conn))
        using (var reader = cmd.ExecuteReader())
        {
            while (reader.Read())
            {
                var Dojo = new Dojo
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Name = reader["Name"] == DBNull.Value ? null : reader["Name"].ToString(),
                    HeroTitle = reader["hero_title"] == DBNull.Value ? null : reader["hero_title"].ToString(),
                    HeroSubtitle = reader["hero_subtitle"] == DBNull.Value ? null : reader["hero_subtitle"].ToString(),
                    HeroImageURL = reader["hero_image_url"] == DBNull.Value ? null : reader["hero_image_url"].ToString(),
                    EstablishedDate = reader["established_date"] == DBNull.Value ? null : reader["established_date"].ToString(),
                    Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString()
                };
                Dojos.Add(Dojo);
            }
        }
        return Dojos;
    }

    public Dojo GetParticularDojo(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        using var cmd = new SqliteCommand("SELECT * FROM Dojo WHERE id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Dojo
            {
                Id = Convert.ToInt32(reader["Id"]),
                Name = reader["Name"] == DBNull.Value ? null : reader["Name"].ToString(),
                HeroTitle = reader["hero_title"] == DBNull.Value ? null : reader["hero_title"].ToString(),
                HeroSubtitle = reader["hero_subtitle"] == DBNull.Value ? null : reader["hero_subtitle"].ToString(),
                HeroImageURL = reader["hero_image_url"] == DBNull.Value ? null : reader["hero_image_url"].ToString(),
                EstablishedDate = reader["established_date"] == DBNull.Value ? null : reader["established_date"].ToString(),
                Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString()
            };
        }
        return null;
    }



    public void InsertDojo(Dojo dojo)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"INSERT INTO Dojo (name,hero_title,hero_subtitle,hero_image_url,established_date,descriptio) VALUEs (@name,@hero_title,@hero_subtitle,@hero_image_url,@established_date,@description)";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@name", dojo.Name ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_title", dojo.HeroTitle ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_subtitle", dojo.HeroSubtitle ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_image_url", dojo.HeroImageURL ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@established_date", dojo.EstablishedDate ?? (object)DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void UpdateDojo(Dojo dojo)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"UPDATE Dojo SET
                    name = @name,
                    hero_title = @hero_title,
                    hero_subtitle = @hero_subtitle,
                    hero_image_url = @hero_image_url,
                    established_date = @established_date,
                    description = @description
                WHERE id = @id";

        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@name", dojo.Name ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_title", dojo.HeroTitle ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_subtitle", dojo.HeroSubtitle ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@hero_image_url", dojo.HeroImageURL ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@established_date", dojo.EstablishedDate ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@description", dojo.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@id", dojo.Id); // important for update WHERE

        cmd.ExecuteNonQuery();
    }


    public void DeleteDojo(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = "DELETE FROM Dojo Where id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }



}