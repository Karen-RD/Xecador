using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AsistenciaController : ControllerBase
    {
        private readonly XecadorContext _context;

        public AsistenciaController(XecadorContext context)
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

        [HttpGet("mes/{anio}/{mes}")]
        public async Task<IActionResult> GetByMes(int anio, int mes)
        {
            var asistencia = await _context.Asistencias
                .Include(a => a.Empleado)
                .Where(a => a.Fecha.Year == anio && a.Fecha.Month == mes)
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