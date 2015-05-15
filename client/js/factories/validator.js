/**
 * Created by maorof on 15/05/15.
 */
/**
 * Created by maorof on 15/05/15.
 */

validationRules = {
    REQUIRED: 'required',
    EMAIL: 'email'

}

app.factory('validator', function ()
{
    var validator = function (rules)
    {
        var validationError = '';



        function isValidEmail(email)
        {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        function validateRequired(value)
        {
            if (value == '')
            {
                validationError = "זהו שדה חובה";
            }
        }

        function validateEmail(value)
        {
            if (!isValidEmail(value))
            {

                ValidationError = "האימייל שהזנת אינו תקין";
            }
        }
        function validate(rule,value)
        {
            if(rule===validationRules.REQUIRED)
            {
                validateRequired(value)
                return;
            }

            if(rule===validationRules.EMAIL)
            {
                validateEmail(value)
                return;
            }
        }

        this.validate=function(value)
        {
            for (var i = 0; i < rules.length; i++)
            {
                var rule = rules[i];
                validate(rule,value);
                if(validationError!='') return validationError;
            }
            return validationError;
        }




    }
    return {
        validator: validator
    };

});


