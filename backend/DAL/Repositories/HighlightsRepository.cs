using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using backend.DAL;
using backend.Models;

namespace backend.DAL.Repositories;

public class HighlightsRepository
{
    private readonly string _connectionString;
    
    public HighlightsRepository()
    {
        _connectionString = DatabaseHelper.ConnectionString;
    }

    public IEnumerable<Highlights> GetAllHighlightss()
    {
        var Highlightss = new List<Highlights>();
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Highlights";
        using var cmd = new SqliteCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var Highlights = new Highlights
            {
                Id = Convert.ToInt32(reader["id"]),
                Title = reader["title"].ToString(),
                Content = reader["content"] == DBNull.Value ? null : reader["content"].ToString(),
            };
            Highlightss.Add(Highlights);
        }
        return Highlightss;
    }

    public Highlights GetParticularHighlights(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Highlights WHERE id=@id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Highlights
            {
                Id = Convert.ToInt32(reader["id"]),
                Title = reader["title"].ToString(),
                Content = reader["content"] == DBNull.Value ? null : reader["content"].ToString(),
            };
        }
        return null;
    }

    public void InsertHighlights(Highlights highlights)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"INSERT INTO HighLights (title, content) VALUES (@title, @content)";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@title",highlights.Title);
        cmd.Parameters.AddWithValue("@content",highlights.Content ?? (object)DBNull.Value);
        
        cmd.ExecuteNonQuery();

    }

    public void UpdateHighlights(Highlights highlights)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = "UPDATE HighLights SET title = @title, content = @content WHERE id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        
        cmd.Parameters.AddWithValue("@id", highlights.Id);
        cmd.Parameters.AddWithValue("@title",highlights.Title);
        cmd.Parameters.AddWithValue("@content",highlights.Content ?? (object)DBNull.Value);
        
    }

    public void DeleteHighlights(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"DELETE FROM Highlights Where id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }



}