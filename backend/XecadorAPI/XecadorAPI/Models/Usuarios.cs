namespace XecadorAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        
        public int? EmpleadoId { get; set; } // Llave foránea hacia Empleados
        public bool Activo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.Now; // Nuevo campo

        // Propiedad de navegación
        public Empleado? Empleado { get; set; }
    }
}