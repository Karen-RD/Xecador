using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XecadorAPI.Data;
using XecadorAPI.Models;

namespace XecadorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreasController : ControllerBase
    {
        private readonly XecadorDbContext _context;

        public AreasController(XecadorDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var areas = await _context.Areas.Where(a => a.Activo).ToListAsync();
            return Ok(areas);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Area area)
        {
            _context.Areas.Add(area);
            await _context.SaveChangesAsync();
            return Ok(area);
        }
    }
}