namespace TravelApp.Models;

public class TravelappItem
{
    public long Id { get; set; }
    public string Place { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public string Description { get; set; }
    public string? ImageUrl { get; set; }
    public long Rating { get; set; }


}