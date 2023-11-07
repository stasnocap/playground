namespace Playground.Api.Form;

public class UpdateToDoForm
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public bool Completed { get; set; }
}