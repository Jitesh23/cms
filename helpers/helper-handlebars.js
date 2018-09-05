var moment = require('moment');


module.exports = {

    select: function(selected, options){
        return options.fn(this).replace(new RegExp('value=\"'+ selected + '\"'), '$&selected="selected"');
    },

    datePicker: function(date, format){

       return moment(date).format(format);

    }
}