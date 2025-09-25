using System;
using System.Collections.Generic;
using Microsoft.Data.SQlite;
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
        using var cmd = new SqliteCommand(sql,conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var Programs = new Programs
            {
                Id = Convert.ToInt32(reader["id"]),
                Name = reader["name"].ToString(),
                Description = reader["description"] == DBNull.Value ? null : reader["description"].ToString(),
                ImageUrl = reader["image_url"] == DBNull.Value ? null : reader["image_url"].ToString(),
                Image = reader["image"] == DBNull.Value ? null : (byte[])reader["image"]
            };
            Programss.Add(Programs);
        }
        return Programss;
    }
}