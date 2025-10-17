using System;
using backend.Models;
using Microsoft.Data.Sqlite;

namespace backend.DAL.Repositories
{
    public class AdminRepository
    {
        private readonly string _connectionString;

        public AdminRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Get Admin by username
        public Admin? GetAdminByUserName(string userName)
        {
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            var sql = "SELECT * FROM Admin WHERE username=@username";
            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@username", userName);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new Admin
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Username = reader["username"].ToString(),
                    PasswordHash = reader["password_hash"].ToString()
                };
            }
            return null;
        }

        public Admin? GetAdminById(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            var sql = "SELECT * FROM Admin WHERE id=@id";
            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return new Admin
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Username = reader["username"].ToString(),
                    PasswordHash = reader["password_hash"].ToString()
                };
            }
            return null;
        }


        // Insert a new admin (used only for setup,one-time, normally)
        public void InsertAdmin(Admin admin)
        {
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            var sql = @"INSERT INTO Admin (username, password_hash) VALUES (@username, @password_hash)";
            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@username", admin.Username ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@password_hash", admin.PasswordHash ?? (object)DBNull.Value);
            cmd.ExecuteNonQuery();
        }

        // Update admin credentials (for changing password or username)
        public void UpdateAdminCredentials(int id, string newUsername, string newPasswordHash)
        {
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            var sql = @"UPDATE Admin SET username = @username, password_hash = @password_hash WHERE id = @id";
            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@username", newUsername ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@password_hash", newPasswordHash ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();
        }

        // Optionally: Delete admin (rare, single admin system)
        public void DeleteAdmin(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            var sql = "DELETE FROM Admin WHERE id = @id";
            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();
        }

    }
}