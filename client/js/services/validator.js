validationRules = {
    REQUIRED: 'required',
    EMAIL: 'email'

}
app.service('validator', function ()
{

    var self=this;



    function isValidEmail(email)
    {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateRequired(value)
    {
        var validationError='';
        if (value == '')
        {
            validationError= "זהו שדה חובה";
        }
        return validationError;
    }

    function validateEmail(value)
    {
        var validationError='';
        if (!isValidEmail(value))
        {

            validationError= "האימייל שהזנת אינו תקין";
        }
        return validationError;
    }

    function validateRule(rule,value)
    {
        if(rule===validationRules.REQUIRED)
        {
            return validateRequired(value)

        } else if(rule===validationRules.EMAIL)
        {
            return validateEmail(value)

        }
    }

    this.validate=function(value,validationRules)
    {
        var validationError='';
        var rules=[]
        if  (validationRules)
        {
            rules=  validationRules.split(', ');
        }
        for (var i = 0; i < rules.length; i++)
        {
            var rule = rules[i];
            validationError=  validateRule(rule,value);
            if  (validationError)
            {
                return  validationError
            }

        }
        return validationError;
    }



});