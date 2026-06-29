namespace XecadorAPI.Models
{
    public class Incidencia
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Estatus { get; set; } = "Pendiente";
        public Empleado? Empleado { get; set; }
    }
}