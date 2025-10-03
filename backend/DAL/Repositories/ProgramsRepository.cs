using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using backend.DAL;
using backend.Models;

namespace backend.DAL.Repositories;

public class ProgramsRepository
{
    private readonly string _connectionString;

    public ProgramsRepository()
    {
        _connectionString = DatabaseHelper.ConnectionString;
    }

    public IEnumerable<Programs> GetAllProgramss()
    {
        var Programss = new List<Programs>();
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Programs";
        using var cmd = new SqliteCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var Programs = new Programs
            {
                Id = Convert.ToInt32(reader["id"]),
                Name = reader["name"].ToString(),
                Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString(),
                ImageUrl = reader["image_url"] == DBNull.Value ? null : reader["image_url"].ToString(),
                Image = reader["image"] == DBNull.Value ? null : (byte[])reader["image"],
                Pricing = reader["pricing"] == DBNull.Value ? null : reader["pricing"].ToString()
            };
            Programss.Add(Programs);
        }
        return Programss;
    }

    public Programs GetParticularPrograms(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Programs WHERE id=@id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Programs
            {
                Id = Convert.ToInt32(reader["id"]),
                Name = reader["name"].ToString(),
                Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString(),
                ImageUrl = reader["image_url"] == DBNull.Value ? null : reader["image_url"].ToString(),
                Image = reader["image"] == DBNull.Value ? null : (byte[])reader["image"],
                Pricing = reader["pricing"] == DBNull.Value ? null : reader["pricing"].ToString()
            };
        }
        return null;
    }


    public void InsertPrograms(Programs programs)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"INSERT INTO Programs(name,description,image_url,image,pricing) VALUES (@name,@description,@image_url,@image,@pricing)";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@name", programs.Name);
        cmd.Parameters.AddWithValue("@description", programs.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image_url", programs.ImageUrl ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image", programs.Image ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@pricing", programs.Pricing ?? (object)DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void UpdatePrograms(Programs programs)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"UPDATE Programs
                    SET name = @name,
                    description = @description,
                    image_url = @image_url,
                    image=@image,
                    pricing=@pricing
                    WHERE id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", programs.Id);
        cmd.Parameters.AddWithValue("@name", programs.Name);
        cmd.Parameters.AddWithValue("@description", programs.Description ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image_url", programs.ImageUrl ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@image", programs.Image ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@pricing", programs.Pricing ?? (object)DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void DeletePrograms(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"DELETE FROM Programs Where id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }

}