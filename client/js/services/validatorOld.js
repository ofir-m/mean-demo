/**
 * Created by maorof on 15/05/15.
 */
app.service('validatorOld', function ()
{

    function validateEmail(email)
    {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }
   this.validateRequired= function (value)
   {
       if (value == '')
       {
           showValidationError = true;
           ValidationError = "זהו שדה חובה";
           //$scope.value=$scope.defaultText;
       }
   }
    this.validate = function (value,type)
    {
        var showValidationError = false;
        var ValidationError = "";
        if (value == '')
        {
            showValidationError = true;
            ValidationError = "זהו שדה חובה";
            //$scope.value=$scope.defaultText;
        }
        else if (!validateEmail(value))
        {
            showValidationError = true;
            ValidationError = "האימייל שהזנת אינו תקין";
        }
        else
        {
            showValidationError = false;
        }

        return {ValidationError: ValidationError, showValidationError: showValidationError}
    }
});

