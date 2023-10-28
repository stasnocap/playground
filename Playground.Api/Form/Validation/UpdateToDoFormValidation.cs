using FluentValidation;

namespace Playground.Api.Form.Validation;

public class UpdateToDoFormValidation : AbstractValidator<UpdateToDoForm>
{
    public UpdateToDoFormValidation()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Text).NotEmpty();
    }
}