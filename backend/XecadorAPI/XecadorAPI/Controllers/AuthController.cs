using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using XecadorAPI.Data;
using XecadorAPI.DTOs;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly XecadorDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(XecadorDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Activo);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
                return Unauthorized(new { message = "Correo o contraseña incorrectos" });

            var token = GenerarToken(usuario);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Nombre = usuario.Nombre,
                Rol = usuario.Rol
            });
        }

        private string GenerarToken(Models.Usuario usuario)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim(ClaimTypes.Name, usuario.Nombre),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ==========================================================
        // ENDPOINT PARA CREAR USUARIOS DE PRUEBA CON CONTRASEÑA ENCRIPTADA
        // ==========================================================
        [HttpPost("crear-usuarios-prueba")]
        public async Task<IActionResult> CrearUsuariosPrueba()
        {
            // Primero borramos los que insertaste mal en SQL para que no haya duplicados
            var usuariosMalos = await _context.Usuarios.ToListAsync();
            _context.Usuarios.RemoveRange(usuariosMalos);
            await _context.SaveChangesAsync();

            // Encriptamos la contraseña "123456" de la forma que a C# le gusta
            var contraseñaEncriptada = BCrypt.Net.BCrypt.HashPassword("123456");

            var usuariosPrueba = new List<Models.Usuario>
            {
                new Models.Usuario 
                { 
                    Nombre = "Karen Rojas", 
                    Email = "admin@xcaret.com", 
                    Rol = "SuperAdmin", 
                    PasswordHash = contraseñaEncriptada, 
                    Activo = true,
                    FechaCreacion = DateTime.Now
                },
                new Models.Usuario 
                { 
                    Nombre = "Admin RH", 
                    Email = "rh@xcaret.com", 
                    Rol = "TalentoHumano", 
                    PasswordHash = contraseñaEncriptada, 
                    Activo = true,
                    FechaCreacion = DateTime.Now
                },
                new Models.Usuario 
                { 
                    Nombre = "Victor Ku Poot", 
                    Email = "supervisor@xcaret.com", 
                    Rol = "Supervisor", 
                    PasswordHash = contraseñaEncriptada, 
                    Activo = true,
                    FechaCreacion = DateTime.Now
                }
            };

            _context.Usuarios.AddRange(usuariosPrueba);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Los usuarios fueron recreados exitosamente con la contraseña '123456' encriptada." });
        }
    }
}