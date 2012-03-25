function Timer() {
  this.startTime = 0;
}

Timer.prototype.start = function() {
  this.startTime = new Date();
}

Timer.prototype.getElapsedTime = function() {
  var endTime = new Date();
  return endTime.getTime() - startTime.getTime();
}