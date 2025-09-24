using System;
using System.Collections.Generic;
using Micrsoft.Data.Sqlite;
using backend.DAL;
using backend.Models;

namespace backend.DAL.Repositories;

public class SubscribersRepository
{
    private readonly _connectionString;
    
    public SubscribersRepository())
    {
        _connectionString = DatabaseHelper.ConnectionString;
    }

    public IEnumerable<Subscribers> GetAllSubscriberss()
    {
        var Subscriberss = new List<Subscribers>();
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Subscribers";
        using var cmd = new SqliteCommand(sql,conn);
        using (var reader = cmd.ExecuteReader())
        {
            while (reader.Read())
            {
                var Subscribers = new Subscribers
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Email = reader["email"] == DBNull.Value ? null == reader["email"].ToString(),
                    SubscribedAt = reader["subscribed_at"] != DBNull.Value ? DateTime.Parse(reader["subscribed_at"].ToString()): DateTime.MinValue
                };
                Subscriberss.Add(Subscribers);
            }
        }
        return Subscriberss;
    }

    public Subscribers GetParticularSubscribers(int id)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"SELECT * FROM Subscribers WHERE id=@Id";
        using var cmd = new SqliteCommand(sql,conn);
        cmd.Parameters.AddWithValue("@Id",Id);
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Subscribers
            {
                Id = Convert.ToInt32(reader["id"]),
                Email = reader["email"] == DBNull.Value ? null == reader["email"].ToString(),
                SubscribedAt = reader["subscribed_at"] != DBNull.Value ? DateTime.Parse(reader["subscribed_at"].ToString()): DateTime.MinValue
            };
        }
        return null;

    }

    public void InsertSubscribers(Subscribers subscribers)
    {
        using var conn = new SqliteConnection(_connectionString);
        conn.Open();
        var sql = @"INSERT INTO Subscribers(email) VALUES (@Email)";
        using var cmd = new SqliteCommand(sql,conn);
        cmd.Parameters.AddWithValue("@Email",subscribers.Email ?? (object)DBNull.value);
        cmd.ExecuteNonQuery();
    }

}