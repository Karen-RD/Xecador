using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnidadesNegocioController : ControllerBase
    {
        private readonly XecadorDbContext _context;

        public UnidadesNegocioController(XecadorDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var unidades = await _context.UnidadesNegocio.Where(u => u.Activo).ToListAsync();
            return Ok(unidades);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UnidadNegocio unidad)
        {
            _context.UnidadesNegocio.Add(unidad);
            await _context.SaveChangesAsync();
            return Ok(unidad);
        }
    }
}