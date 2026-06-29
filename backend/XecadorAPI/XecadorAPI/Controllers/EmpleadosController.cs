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
    public class EmpleadosController : ControllerBase
    {
        private readonly XecadorContext _context;

        public EmpleadosController(XecadorContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var empleados = await _context.Empleados
                .Where(e => e.Activo)
                .ToListAsync();
            return Ok(empleados);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Empleado empleado)
        {
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();
            return Ok(empleado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Empleado empleado)
        {
            var existente = await _context.Empleados.FindAsync(id);
            if (existente == null) return NotFound();

            existente.NombreCompleto = empleado.NombreCompleto;
            existente.Area = empleado.Area;
            existente.Puesto = empleado.Puesto;
            existente.Horario = empleado.Horario;
            existente.Guardia = empleado.Guardia;

            await _context.SaveChangesAsync();
            return Ok(existente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null) return NotFound();
            empleado.Activo = false;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}