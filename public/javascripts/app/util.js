var fieldHumanize = function(string){
  var s = string.replace(/_/, ' ');
  return capitalize(s);
}

var capitalize = function(string) {
  var body = string.substring(1, string.length);
  var firstLetter = string.charAt(0).toUpperCase();
  return firstLetter + body;
}