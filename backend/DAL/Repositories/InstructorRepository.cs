using System;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using backend.DAL;
using backend.Models;

namespace backend.DAL.Repositories;

public class InstructorRepository
{
    private readonly string _connectionString;

    public InstructorRepository()
    {
        _connectionString = DatabaseHelper.ConnectionString;
    }

    public IEnumerable<Instructor> GetAllInstructors()
    {
        var Instructors = new List<Instructor>();
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Instructor";
        using var cmd = new SqliteCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var Instructor = new Instructor
            {
                Id = Convert.ToInt32(reader["id"]),
                Name = reader["name"].ToString(),
                Role = reader["role"].ToString(),
                Phone = reader["phone"] == DBNull.Value ? null : reader["phone"].ToString(),
                Email = reader["email"] == DBNull.Value ? null : reader["email"].ToString(),
                PhotoUrl = reader["photo_url"] == DBNull.Value ? null : reader["photo_url"].ToString(),
                Photo = reader["photo"] == DBNull.Value ? null : (byte[])reader["photo"]
            };
            Instructors.Add(Instructor);
        }
        return Instructors;
    }

    public Instructor GetParticularInstructor(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Instructor WHERE id=@id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Instructor
            {
                Id = Convert.ToInt32(reader["id"]),
                Name = reader["name"].ToString(),
                Role = reader["role"].ToString(),
                Phone = reader["phone"] == DBNull.Value ? null : reader["phone"].ToString(),
                Email = reader["email"] == DBNull.Value ? null : reader["email"].ToString(),
                PhotoUrl = reader["photo_url"] == DBNull.Value ? null : reader["photo_url"].ToString(),
                Photo = reader["photo"] == DBNull.Value ? null : (byte[])reader["photo"]
            };
        }
        return null;
    }

    public void InsertInstructor(Instructor instructor)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"INSERT INTO Instructor (name, role, phone, email, photo_url, photo) 
                VALUES (@name, @role, @phone, @email, @photo_url, @photo)";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@name", instructor.Name);
        cmd.Parameters.AddWithValue("@role", instructor.Role);
        cmd.Parameters.AddWithValue("@phone", instructor.Phone ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@email", instructor.Email ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@photo_url", instructor.PhotoUrl ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@photo", instructor.Photo ?? (object)DBNull.Value);

        cmd.ExecuteNonQuery();
    }




    public void UpdateInstructor(Instructor instructor)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"UPDATE Instructor SET name=@name, role=@role, phone=@phone, email=@email, photo_url=@photo_url, photo=@photo 
                    WHERE id=@id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", instructor.Id);
        cmd.Parameters.AddWithValue("@name", instructor.Name);
        cmd.Parameters.AddWithValue("@role", instructor.Role);
        cmd.Parameters.AddWithValue("phone", instructor.Phone ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("email", instructor.Email ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@photo_url", instructor.PhotoUrl ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@photo", instructor.Photo ?? (object)DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void DeleteInstructor(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"DELETE FROM Instructor Where id = @id";
        using var cmd = new SqliteCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }
}