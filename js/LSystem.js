
function LSystem(name, axiom, rules, angleStep, author, notes) {
  this.name  = name;
  this.axiom = axiom;
  this.rules = rules;
  this.angle = angleStep;
  this.author = author;
  this.notes = notes;
  this.rules = rules;

  this.commands = axiom;
  this.level = 0;

  // Variables storing the outer boundaries of the fractal
  this.xMin = 0;
  this.xMax = 0;
  this.yMin = 0;
  this.yMax = 0;
}

LSystem.prototype.reset = function() {
  this.commands = this.axiom;
  this.level = 0;
}

LSystem.prototype.rulesEqual = function(otherRules) {
  if (this.rules.length != otherRules.length) {
    return false;
  }

  for (var i in this.rules) {
    if ( this.rules[i] != otherRules[i] ) {
      return false;
    }
  }

  return true;
}

LSystem.prototype.equals = function(otherSystem) {
  return (this.name == otherSystem.name)
  && (this.axiom == otherSystem.axiom)
  && (this.rulesEqual(otherSystem.rules))
  && (this.angle == otherSystem.angle);
}

LSystem.prototype.serialize = function() {
  var ruleString = '';
  for (var key in this.rules) {
    ruleString += key + '=' + this.rules[key] + ',';
  }
  ruleString = ruleString.substring(0, ruleString.length - 1); // chop off last comma
  return {
    'name': this.name,
    'axiom': this.axiom,
    'rules': ruleString,
    'angle': this.angle,
    'author': this.author,
    'notes': this.notes
  }
}

LSystem.prototype.advanceLevel = function() {
  var nextLevel = "";
  var len = this.commands.length;
  for (i=0; i<len; ++i) {
    var c = this.commands.charAt(i);
    if ( this.rules[c] ) {
      nextLevel += this.rules[c];
    } else {
      nextLevel += c;
    }
  }
  this.commands = nextLevel;
  $('#commands').text(this.commands);
  this.level++;
}

LSystem.prototype.calculateBounds = function() {
  this.xMin = 0;
  this.xMax = 0;
  this.yMin = 0;
  this.yMax = 0;
  
  var x = 0;
  var y = 0;

  var angle = 0;
  var angleStep =  Math.toRadians(-this.angle);

  var stack = new Array();

  var len = this.commands.length;
  for (var i=0; i<len; ++i) {
    var c = this.commands.charAt(i);
    switch (c) {
      case 'F':
      case 'D':
      case 'M':
      case 'G':
        // foreward
        x += Math.cos(angle);
        y += Math.sin(angle);
        if (x < this.xMin) this.xMin = x;
        if (x > this.xMax) this.xMax = x;
        if (y < this.yMin) this.yMin = y;
        if (y > this.yMax) this.yMax = y;
        break;
      case '+': // turn left
        angle += angleStep;
        break;
      case '-': // turn right
        angle -= angleStep;
        break;
      case '[': // push coordinates and angle
        stack.push(x, y, angle);
        break;
      case ']': // pop coordinates and angle
        angle = stack.pop();
        y = stack.pop();
        x = stack.pop();
        break;
      default:
    // Ignore it like a bitch
    }
  }
}

// ---------------- Support methods ------------------


// Functions to simplify finding min/max in an array
Array.max = function(array){
  return Math.max.apply(Math, array);
}
Array.min = function(array){
  return Math.min.apply(Math, array);
}

// User inputs degress, but trig functions require radians
Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
}

// StringBuffer class speeds up advanceLevel function
function StringBuffer() {
  this.buffer = [];
}

StringBuffer.prototype.append = function append(string) {
  this.buffer.push(string);
  return this;
}

StringBuffer.prototype.toString = function toString() {
  return this.buffer.join("");
}

