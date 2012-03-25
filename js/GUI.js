
function GUI() {
}

// --------------- Rule manipulation methods ------------------

// A ruleInput contains the data for a rule of an L-System. It is made up of a
//  text input, an arrow, and another text input.
GUI.createRuleInputs = function() {
    var predecessor = '<input type="text" class="predecessor"'
    + 'onchange="this.value = this.value.toUpperCase()" title="Predecessor" />';
    var arrow = '<span> → </span>';
    var successor   =  '<input type="text" class="successor"'
    + 'onchange="this.value = this.value.toUpperCase()" title="Successor" />';
    return $('<div class="rule"></div>').html(predecessor + arrow + successor);
}

// Puts the contents of a Rule object into a ruleInputs
GUI.setRuleInputs = function(predecessor, successor, $ruleInputs) {
    $ruleInputs.children('.predecessor').val(predecessor);
    $ruleInputs.children('.successor').val(successor);
    return $ruleInputs;
}

// Add the ruleInputs to the rules container
GUI.appendRuleInputs = function($ruleInputs) {
    $('#rules_container').append($ruleInputs);
}

// Appends ruleInputs without any data in them. Triggered when the user adds
// a new rule.
GUI.appendBlankRuleInputs = function() {
    GUI.appendRuleInputs( GUI.createRuleInputs() );
}

// Puts a predecessor and a successor into a ruleInputs and appends it to the
// rules container
GUI.appendRule = function(predecessor, successor) {
    GUI.appendRuleInputs( GUI.setRuleInputs(predecessor, successor, GUI.createRuleInputs()) );
}

// Removes the last rule in the rules container
GUI.removeRule = function () {
    var r = $('#rules_container').children();
    if (r.length > 1) {
        r.last().remove();
    }
}

// Create Rule objects from the data in the rules container and put them into an array
GUI.getRules = function() {
    var rules = new Array();
    var $ruleElement = $('#rules_container').children();

    for (i=0; i<$ruleElement.length; ++i) {
        var $ruleInputs = $ruleElement.eq(i);
        var predecessor = $ruleInputs.children('.predecessor').val();
        var sucessor = $ruleInputs.children('.successor').val();
        rules[predecessor] = sucessor;
    }
    return rules;
}


// --------------- System manipulation methods ------------------

// Set the GUI to match the data in an LSystem object
GUI.setSystem = function(sys) {
    $('#name').val(sys.name);
    $('#axiom').val(sys.axiom);
    $('#angle').val(sys.angle);
    $('#rules_container').empty();  // clear all rules
    for (var i in sys.rules) {
        GUI.appendRule(i, sys.rules[i]);
    }
    $('#author').val(sys.author);
    $('#notes').val(sys.notes);
    $('#commands').text(sys.commands);
    sys.calculateBounds();
    GUI.drawSystem(sys);
}

// Get data from the GUI and and put it into an LSystem object
// Returns the LSystem
GUI.getSystem = function() {
    var name   = $('#name').val();
    var axiom  = $('#axiom').val();
    var angle  = $('#angle').val();
    var rules  = GUI.getRules();
    var author = $('#author').val();
    var notes = $('#notes').val();
    return new LSystem(name, axiom, rules, angle, author, notes);
}

// Resets transformations and clears the canvas.
GUI.resetCanvas = function () {
    var canv = $('#canvas')[0];
    var ctx = canv.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);  // reset any tranformations
    ctx.clearRect(0, 0, canv.width, canv.height);  // clear canvas
}

// Calculates the appropriate transformations and draws the given LSystem.
GUI.drawSystem = function(sys) {
    GUI.resetCanvas()
    var canv = $('#canvas')[0];
    var ctx = canv.getContext('2d');
    ctx.beginPath();

    var x = 0;
    var y = 0;

    var size = Math.min(canv.width, canv.height);
    var scale = (size - 20) / Math.max(sys.xMax - sys.xMin, sys.yMax - sys.yMin);
    var xTrans = -sys.xMin * scale + ( size / 2 - (sys.xMax * scale - sys.xMin * scale) / 2 );
    var yTrans = -sys.yMin * scale + ( size / 2 - (sys.yMax * scale - sys.yMin * scale) / 2 );
    ctx.translate(xTrans, yTrans);
    ctx.moveTo(0, 0);

    var angle = 0;
    var angleStep =  Math.toRadians(-sys.angle);

    var stack = new Array();

    var len = sys.commands.length;
    for (var i=0; i<len; ++i) {
        switch ( sys.commands.charAt(i) ) {
            case 'D':
            case 'F':
                // draw foreward
                x += scale * Math.cos(angle);
                y += scale * Math.sin(angle);
                ctx.lineTo(x, y);
                break;
            case 'G':
            case 'M':
                // move foreward without drawing
                x += scale * Math.cos(angle);
                y += scale * Math.sin(angle);
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
                ctx.moveTo(x, y);
                break;
            default:
        // Ignore
        }
    }
    ctx.stroke();
}


// ----------------- Table methods -----------------

GUI.getTableSystem = function(row) {
    var $data = $(row).children();
    var name  = $data.eq(0).text();
    var axiom = $data.eq(1).text();
    var rulesTxt = $data.eq(2).html().split('<br>');
    var angle = $data.eq(3).text();
    var author = $data.eq(4).text();
    var notes = $data.eq(5).text();

    // We need to extract the predecessor and successor from each rule, which
    // is separated by ' ? '
    // 'rules.length - 1' is used because there is a <br> at the end of all the
    // rules, which causes the last array element to be blank.
    var rules = new Array();
    for (var i=0; i < rulesTxt.length - 1; ++i) {
        var r = rulesTxt[i].split('\u2192'); // split at arrow
        var predecessor = r[0].trim();
        var successor = r[1].trim();
        rules[predecessor] = successor;
    }
  
    return new LSystem(name, axiom, rules, angle, author, notes);
}

GUI.tableClick = function() {
    $('.highlight').removeClass('highlight');
    $(this).addClass('highlight');
    sys = GUI.getTableSystem(this);
    GUI.setSystem(sys);
}

GUI.appendTableSystem = function(sys) {
    var rules = '';
    for (var i in sys.rules) {
        rules += i + ' → ' + sys.rules[i] + '<br>';
    }
  
    var $row = $('<tr class="sys">'
        + '<td>' + sys.name   + '</td>'
        + '<td>' + sys.axiom  + '</td>'
        + '<td>' + rules      + '</td>'
        + '<td>' + sys.angle  + '</td>'
        + '<td>' + sys.author + '</td>'
        + '<td>' + sys.notes  + '</td>'
        + '</tr>'
        );
    $('#main_systems').append($row);
    return $row;
}

GUI.expanderClick = function() {
    var $expander = $(this);
    if ( $expander.hasClass('collapsed') ) {
        $expander.removeClass('collapsed');
        $expander.next().slideDown(500, function() {
            $(this).prev().children('.state').text('Hide');
        })
    } else {
        $expander.next().slideUp(500, function() {
            var $expander = $(this).prev();
            $expander.addClass('collapsed');
            $expander.children('.state').text('Show');
        });
    }
}