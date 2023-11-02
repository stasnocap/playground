using Playground.Models;

namespace Playground.Data.Seeders;

public class TodoSeeder
{
    public void Seed(AppDbContext appDbContext)
    {
        var todos = new List<ToDo>
        {
            new ToDo
            {
                Text = "Do something nice for someone I care about"
            },
            new ToDo
            {
                Text = "Memorize the fifty states and their capitals"
            },
            new ToDo
            {
                Text = "Watch a classic movie"
            },
            new ToDo
            {
                Text = "Contribute code or a monetary donation to an open-source software project"
            },
            new ToDo
            {
                Text = "Solve a Rubik's cube"
            },
            new ToDo
            {
                Text = "Bake pastries for me and neighbor"
            },
            new ToDo
            {
                Text = "Write a thank you letter to an influential person in my life"
            },
            new ToDo
            {
                Text = "Go see a Broadway production"
            },
            new ToDo
            {
                Text = "Invite some friends over for a game night"
            },
            new ToDo
            {
                Text = "Have a football scrimmage with some friends"
            },
        };

        appDbContext.AddRange(todos);

        appDbContext.SaveChanges();
    }
}