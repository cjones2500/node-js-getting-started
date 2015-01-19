// Define a class like this
function HtmlTableBuilder(dataArray){
    this.dataArray = dataArray;
}

//function to build a twitter bootstrap table
HtmlTableBuilder.prototype.buildTable = function(){
    html = '<div class="bs-example"><table class="table table-striped table-bordered table-condensed"><thread><tr>'
    
    //loop through all the fields at the top
    v = this.dataArray[0];
    $.each(v, function(innerKey, innerValue) {
        var val = v[innerKey];
        html = html + '<th>' + innerKey + '</th>'
    });
    
    html = html + '</tr></thread>';
    
    //build the data rows by looping through all the data
    $.each(this.dataArray, function(k, v) {
        html = html + '<tr>';
        $.each(v, function(innerKey, innerValue) {
            var val = v[innerKey];
            html = html + '<td>' + innerValue + '</td>'
        });
        html = html + '</tr>';
    });
    
    html = html + '</tbody></table></div>'
    return html   
}