using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class HorariosController : ControllerBase
    {
        private readonly XecadorDbContext _context;

        public HorariosController(XecadorDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var horarios = await _context.Horarios.ToListAsync();
            return Ok(horarios);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Horario horario)
        {
            _context.Horarios.Add(horario);
            await _context.SaveChangesAsync();
            return Ok(horario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Horario horario)
        {
            var existente = await _context.Horarios.FindAsync(id);
            if (existente == null) return NotFound();
            existente.Nombre = horario.Nombre;
            existente.HoraInicio = horario.HoraInicio;
            existente.HoraFin = horario.HoraFin;
            existente.Dias = horario.Dias;
            existente.HorasSemanales = horario.HorasSemanales;
            await _context.SaveChangesAsync();
            return Ok(existente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var horario = await _context.Horarios.FindAsync(id);
            if (horario == null) return NotFound();
            _context.Horarios.Remove(horario);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}