var sys;
var logger;
var timer;

$(document).ready(function() {
    sys = GUI.getSystem();

    // calculate the next level of the system and draw it
    $('#next_level').click(function() {
        var sys2 = GUI.getSystem();
        // if the user picked a new system, 'sys' has to be replaced
        if ( sys.equals(GUI.getSystem()) == false ) {
            sys = sys2;
        }
        sys.advanceLevel();
        sys.calculateBounds();
        GUI.drawSystem(sys);
    });

    // reset the system's level
    $('#reset').click(function() {
        sys.reset();
        GUI.setSystem(sys);
    });

    $('#next_sys').click(function() {
        $('tr.highlight').next().click();
    })

    $('#add_rule').click( GUI.appendBlankRuleInputs );
    $('#remove_rule').click( GUI.removeRule );

    // expand the notes textarea when it gets focus (for easier reading)
    $('#notes').focus(function() {
        this.rows = 6
    });
    // contract it when it loses focus (so it's less intrusive)
    $('#notes').blur(function() {
        this.rows = 3
    });

    // restrict the text inputs to upper case
    // this makes it easier to use and read (in my opinion)
    $('input.upper').change(function() {
        this.value = this.value.toUpperCase()
    });

    // expanders are the bars above each gui frame
    // they show and hide their respective frame (their next sibling)
    $('div.expander').click( GUI.expanderClick );

    // When the user hovers over an expander, it will reveal
    // the word 'Hide' or 'Show' which is contained in a
    // span element with the class '.state
    $('div.expander').hover(
        function() {
            $(this).children('.state').show()
            },
        function() {
            $(this).children('.state').hide()
            }
        );

    // When a table row is clicked it transfers its data to the gui
    $('tr.sys').click( GUI.tableClick ).first().click();  // select the first fractal

    // Sends the current L-system variables to the server and appends a new
    // L-system to the table unless there are errors.
    $('#submit').click(function() {
        var submittedSystem = GUI.getSystem();
        $.post('/submit', submittedSystem.serialize(), function(response) {
            var $err = $('err', response);  // error messages are sent between <err> tags
            if ($err.length) {
                alert('Error: ' + $err.text());
            } else {
                alert('Your fractal was successfully submitted');
                GUI.appendTableSystem( submittedSystem ).click( GUI.tableClick ).click();
            }
        });
    });
});