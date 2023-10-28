using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Playground.Api.Form;
using Playground.Data;
using Playground.Models;

namespace Playground.Api.Controllers;

[ApiController]
[Route("api/todos")]
public class ToDoController : ControllerBase
{
    private readonly AppDbContext _ctx;

    public ToDoController(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    [HttpGet]
    public Task<List<ToDo>> All() => _ctx.ToDos
        .AsNoTracking()
        .ToListAsync();

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var toDo = await _ctx.ToDos
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (toDo == null)
        {
            return NoContent();
        }

        return Ok(toDo);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateToDoForm createToDoForm)
    {
        var toDo = new ToDo
        {
            Text = createToDoForm.Text
        };

        _ctx.Add(toDo);

        await _ctx.SaveChangesAsync();

        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateToDoForm updateToDoForm)
    {
        var toDo = await _ctx.ToDos.FirstOrDefaultAsync(x => x.Id == updateToDoForm.Id);

        if (toDo == null)
        {
            return NoContent();
        }

        toDo.Text = updateToDoForm.Text;

        _ctx.ToDos.Update(toDo);

        await _ctx.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var toDo = await _ctx.ToDos.FirstOrDefaultAsync(x => x.Id == id);
        
        if (toDo == null)
        {
            return NoContent();
        }

        _ctx.ToDos.Remove(toDo);

        await _ctx.SaveChangesAsync();

        return Ok();
    }
}