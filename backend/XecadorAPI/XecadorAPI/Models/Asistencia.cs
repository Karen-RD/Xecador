namespace XecadorAPI.Models
{
    public class Asistencia
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Entrada { get; set; }
        public string? Salida { get; set; }
        public string Estado { get; set; } = "A"; // Default a "Asistencia"
        public string? Observaciones { get; set; } // Nuevo campo

        // Propiedad de navegación
        public Empleado? Empleado { get; set; }
    }
}