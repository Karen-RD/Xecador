using Microsoft.EntityFrameworkCore;
using XecadorAPI.Models;

namespace XecadorAPI.Data
{
    public class XecadorContext : DbContext
    {
        public XecadorContext(DbContextOptions<XecadorContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Incidencia> Incidencias { get; set; }
    }
}