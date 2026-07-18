using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class AsistenciaController : ControllerBase
    {
        private readonly XecadorDbContext _context;

        public AsistenciaController(XecadorDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var asistencia = await _context.Asistencias
                .Include(a => a.Empleado)
                .ToListAsync();
            return Ok(asistencia);
        }

        [HttpGet("empleado/{empleadoId}")]
        public async Task<IActionResult> GetByEmpleado(int empleadoId)
        {
            var asistencia = await _context.Asistencias
                .Where(a => a.EmpleadoId == empleadoId)
                .OrderByDescending(a => a.Fecha)
                .ToListAsync();
            return Ok(asistencia);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Asistencia asistencia)
        {
            _context.Asistencias.Add(asistencia);
            await _context.SaveChangesAsync();
            return Ok(asistencia);
        }
    }
}