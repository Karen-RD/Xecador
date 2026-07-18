namespace XecadorAPI.Models
{
    public class Incidencia
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public string? NombreEmpleado { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string? Motivo { get; set; } // Nuevo campo
        public string Estatus { get; set; } = "Pendiente";
        
        public int? AprobadoPor { get; set; } // Llave foránea hacia Usuarios
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;
        public DateTime? FechaResolucion { get; set; } // Nullable, porque inicia sin resolución

        // Propiedades de navegación
        public Empleado? Empleado { get; set; }
        public Usuario? Aprobador { get; set; }
    }
}