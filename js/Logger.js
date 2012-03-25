function Logger() {
}

Logger.log = function(text) {
  $('#log').append('<div>> ' + text + '</div>');
}

Logger.warn = function(text) {
  $('#log').append('<div class="warn">> ' + text + '</div>');
}

Logger.error = function(text) {
  $('#log').append('<div class="err">> ' + text + '</div>');
}

Logger.clear = function() {
  $('#log').empty();
}