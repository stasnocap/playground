using FluentValidation;

namespace Playground.Api.Form.Validation;

public class CreateToDoFormValidation : AbstractValidator<CreateToDoForm>
{
    public CreateToDoFormValidation()
    {
        RuleFor(x => x.Text).NotEmpty();
    }
}