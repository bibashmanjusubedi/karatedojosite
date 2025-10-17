using Microsoft.AspNetCore.Mvc;
using backend.DAL.Repositories;
using backend.Models;
using System.Security.Cryptography;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminRepository _adminRepository;

        public AdminController(AdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        // POST: api/admin/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] AdminRegisterDto registerDto)
        {
            // Check if user already exists
            var existingAdmin = _adminRepository.GetAdminByUserName(registerDto.Username);
            if (existingAdmin != null)
                return Conflict(new { message = "Username already exists" });

            // Hash the password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Create new Admin model
            var newAdmin = new Admin
            {
                Username = registerDto.Username,
                PasswordHash = passwordHash
            };

            // Insert to database
            _adminRepository.InsertAdmin(newAdmin);

            return Ok(new { message = "Admin registered successfully" });
        }


        // POST: admin/api/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginDto loginDto)
        {
            var admin = _adminRepository.GetAdminByUserName(loginDto.Username);
            if (admin == null)
                return Unauthorized(new { message = "Invalid username or password" });

            bool valid = BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.PasswordHash);
            if (!valid)
                return Unauthorized(new { message = "Invalid username or password" });


            // JWT Creation logic
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes("my_super_secure_long_secret_key_123456");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name,admin.Username),
                    new Claim("AdminId", admin.Id.ToString())
                }),
                Expires = DateTime.Now.AddHours(2),
                Issuer = "myIssuer",
                Audience = "myAudience",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(new { token = jwt, message = "Login successful" });
        }

        // PUT: api/admin/update
        [HttpPut("update")]
        public IActionResult UpdateCredentials([FromBody] AdminUpdateDto updateDto)
        {
            var admin = _adminRepository.GetAdminByUserName(updateDto.CurrentUsername);
            if (admin == null)
                return NotFound(new { message = "Admin not found" });

            bool valid = BCrypt.Net.BCrypt.Verify(updateDto.CurrentPassword, admin.PasswordHash);
            if (!valid)
                return Unauthorized(new { message = "Incorrect current password " });

            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.NewPassword);
            _adminRepository.UpdateAdminCredentials(admin.Id, updateDto.NewUsername, newPasswordHash);

            return Ok(new { message = "Admin credentials updated" });
        }

        // Get: api/admin/profile
        // For admin info (never send password hash)
        [HttpGet("profile")]
        public IActionResult GetProfile([FromQuery] string username)
        {
            var admin = _adminRepository.GetAdminByUserName(username);
            if (admin == null)
                return NotFound();

            return Ok(new { admin.Id, admin.Username });
        }

        // DELETE: api/admin/delete/{id}
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteAdmin(int id)
        {
            var admin = _adminRepository.GetAdminById(id); // You may want to implement this if not present
            if (admin == null)
                return NotFound(new { message = "Admin not found" });

            _adminRepository.DeleteAdmin(id);
            return Ok(new { message = "Admin deleted successfully" });
        }


    }
}