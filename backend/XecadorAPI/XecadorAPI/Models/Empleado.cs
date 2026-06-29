namespace XecadorAPI.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string Puesto { get; set; } = string.Empty;
        public string Horario { get; set; } = string.Empty;
        public string Guardia { get; set; } = "Ninguna";
        public bool Activo { get; set; } = true;
    }
}