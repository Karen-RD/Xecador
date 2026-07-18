using Microsoft.EntityFrameworkCore;
using XecadorAPI.Models;

namespace XecadorAPI.Data
{
    public class XecadorDbContext : DbContext
    {
        public XecadorDbContext(DbContextOptions<XecadorDbContext> options) : base(options) { }

        public DbSet<UnidadNegocio> UnidadesNegocio { get; set; }
        public DbSet<Area> Areas { get; set; }
        public DbSet<Horario> Horarios { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Incidencia> Incidencias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuración de la llave única compuesta para evitar duplicados de asistencia
            modelBuilder.Entity<Asistencia>()
                .HasIndex(a => new { a.EmpleadoId, a.Fecha })
                .IsUnique();
        }
    }
}