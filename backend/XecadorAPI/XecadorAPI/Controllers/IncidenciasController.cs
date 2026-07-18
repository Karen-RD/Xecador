using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidenciasController : ControllerBase
    {
        private readonly XecadorDbContext _context;

        public IncidenciasController(XecadorDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var incidencias = await _context.Incidencias.ToListAsync();
            return Ok(incidencias);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Incidencia incidencia)
        {
            _context.Incidencias.Add(incidencia);
            await _context.SaveChangesAsync();
            return Ok(incidencia);
        }
    }
}