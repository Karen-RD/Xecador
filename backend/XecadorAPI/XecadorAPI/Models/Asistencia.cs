namespace XecadorAPI.Models
{
    public class Asistencia
    {
        public int Id { get; set; }
        public int EmpleadoId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Entrada { get; set; }
        public string? Salida { get; set; }
        public string Estado { get; set; } = string.Empty;
        public Empleado? Empleado { get; set; }
    }
}