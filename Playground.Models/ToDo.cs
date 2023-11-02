namespace Playground.Models
{
    public class ToDo : BaseModel
    {
        public string Text { get; set; }
        public bool Completed { get; set; }
    }
}