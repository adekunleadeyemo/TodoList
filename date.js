//jshint esversion:6

exports.getDate = function () {
    let today = new Date();
    let options = {
        day:"numeric", 
        month :"long", 
        weekday : "long"
    }
    var day = today.toLocaleDateString("en-US",options);
    return day
}
