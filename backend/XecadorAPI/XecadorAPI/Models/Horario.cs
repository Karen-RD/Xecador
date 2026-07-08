namespace XecadorAPI.Models
{
    public class Horario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string HoraInicio { get; set; } = string.Empty;
        public string HoraFin { get; set; } = string.Empty;
        public string Dias { get; set; } = string.Empty;
        public int HorasSemanales { get; set; } = 48;
    }
}