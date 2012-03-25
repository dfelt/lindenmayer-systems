
def err(field, msg):
    print '<err field="%s">%s</err>' % (field, msg)

name = "Koch"
axiom = "F--F--F"
angle = "60"
rules = "F=F+F--F+F".split(',')
author = "Mandelbrot"
notes = "Some notes here!"

print rules

if not name:
    err('name', 'There must be a NAME')
elif len(name) > 30:
    err('name', 'The NAME must contain no more than 30 letters')

if not axiom:
    err('axiom', 'There must be an INITIAL STRING')
elif len(axiom) > 50:
    err('axiom', 'The INITIAL STRING must contain no more than 50 letters')

if not rules:
    err('rules', 'There must be at least one RULE')
else:
    splitRules = []
    for rule in rules:
        r = rule.split('=')
        splitRules.append( r[0] )
        splitRules.append( r[1] )
    print splitRules

if len(author) > 30:
    err('author', 'The AUTHOR must contain no more than 30 letters')

if len(notes) > 160:
    err('notes', 'The NOTES must contain no more than 160 letters (think Twitter)')

try:
    angle = float(angle)
except:
    err('angle', 'The ANGLE must be a number')
