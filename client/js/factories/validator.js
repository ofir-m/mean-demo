///**
// * Created by maorof on 15/05/15.
// */
///**
// * Created by maorof on 15/05/15.
// */
//
//validationRules = {
//    REQUIRED: 'required',
//    EMAIL: 'email'
//
//}

//app.service('validator', function ()
//{
//
//        var self=this;
//
//
//
//        function isValidEmail(email)
//        {
//            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
//            return re.test(email);
//        }
//
//        function validateRequired(value)
//        {
//            var validationError='';
//            if (value == '')
//            {
//                validationError= "זהו שדה חובה";
//            }
//            return validationError;
//        }
//
//        function validateEmail(value)
//        {
//            var validationError='';
//            if (!isValidEmail(value))
//            {
//
//                validationError= "האימייל שהזנת אינו תקין";
//            }
//            return validationError;
//        }
//
//        function validateRule(rule,value)
//        {
//            if(rule===validationRules.REQUIRED)
//            {
//                return validateRequired(value)
//
//            } else if(rule===validationRules.EMAIL)
//            {
//                return validateEmail(value)
//
//            }
//        }
//
//        this.validate=function(value,rules)
//        {
//            var validationError='';
//            for (var i = 0; i < rules.length; i++)
//            {
//                var rule = rules[i];
//                validationError=  validateRule(rule,value);
//
//            }
//            return validationError;
//        }
//
//
//
//});

//app.factory('validator1', function ()
//{
//    var validator = function (rules)
//    {
//        // if (!rules) return;
//        var self=this;
//        this.validationError = '';
//
//
//        function isValidEmail(email)
//        {
//            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
//            return re.test(email);
//        }
//
//        function validateRequired(value)
//        {
//            if (value == '')
//            {
//                self.validationError = "זהו שדה חובה";
//            }
//        }
//
//        function validateEmail(value)
//        {
//            if (!isValidEmail(value))
//            {
//
//                self.validationError = "האימייל שהזנת אינו תקין";
//            }
//        }
//
//        function validate(rule,value)
//        {
//            if(rule===validationRules.REQUIRED)
//            {
//                validateRequired(value)
//
//            } else if(rule===validationRules.EMAIL)
//            {
//                validateEmail(value)
//
//            }
//        }
//
//        this.validate=function(value)
//        {
//            this.validationError='';
//            for (var i = 0; i < rules.length; i++)
//            {
//                var rule = rules[i];
//                validate(rule,value);
//                if(this.validationError!='') return this.validationError;
//            }
//            return this.validationError;
//        }
//
//
//
//
//    }
//    return {
//        validator: validator
//    };
//
//});
