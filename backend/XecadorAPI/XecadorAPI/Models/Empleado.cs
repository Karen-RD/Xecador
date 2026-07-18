namespace XecadorAPI.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string? UnidadNegocio { get; set; } // Nuevo campo
        public string Area { get; set; } = string.Empty;
        public string Puesto { get; set; } = string.Empty;
        public string? Horario { get; set; } 
        public string Guardia { get; set; } = "Ninguna";
        
        public int? HorarioId { get; set; } // Llave foránea hacia Horarios
        public bool Activo { get; set; } = true;
        public DateTime FechaAlta { get; set; } = DateTime.Now; // Nuevo campo

        // Propiedad de navegación
        public Horario? HorarioAsignado { get; set; } 
    }
}