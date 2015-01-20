// Define a class like this
function OPDatabase(url,db){
    this.url = url;    
    this.db = db;
}

OPDatabase.prototype.postToDb = function(dataToSend){
    $.ajax({
        url: this.url + this.db,
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        contentType: 'application/json',
        processData: false,
        data: dataToSend,
        success: function (data) {
            console.log('OPDatabase::postToDb::success', JSON.stringify(data));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('OPDatabase::postToDb::error', errorThrown);
        }
    });   
}

OPDatabase.prototype.getAllFromDb = function(callBack){
    $.ajax({
        url: this.url + this.db,
        type: 'GET',
        crossDomain: true,
        accepts: "application/json; charset=utf-8", //force to send back JSON format
        contentType: 'application/json',
        success: function (data) {
            callBack(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('OPDatabase::getFromDb::error' + XMLHttpRequest +" " + textStatus + " " errorThrown);
        }
    });
}


OPDatabase.prototype.deleteFromDb = function(dataToSend){
    $.ajax({
        url: this.url + this.db,
        type: 'DELETE',
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('OPDatabase::deleteFromDb::success', JSON.stringify(data));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('OPDatabase::deleteFromDb::error', errorThrown);
        }
    });   
}

