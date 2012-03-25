
import os

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class Fractal(db.Model):
    name = db.StringProperty()
    axiom = db.StringProperty()
    rules = db.StringListProperty()
    angle = db.FloatProperty()
    author = db.StringProperty()
    notes = db.StringProperty(multiline=True)
    
class MainPage(webapp.RequestHandler):
    def get(self):
        fractals = Fractal.all().fetch(50)
        template_values = {'fractals': fractals}
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        html = template.render(path, template_values)
        self.response.out.write(html)

class FractalSubmit(webapp.RequestHandler):
    fractalError = False;
    
    def get(self):
        self.post()

    def err(self, field, message):
        self.response.out.write('<err field="%s">%s</err>' % (field, message))
        self.fractalError = True;
        
    def post(self):
        self.response.headers["Content-Type"] = "text/plain"
        self.response.out.write('<response>')

        name = self.request.get('name')
        axiom = self.request.get('axiom')
        rules = self.request.get('rules').split(',')
        angle = self.request.get('angle')
        author = self.request.get('author')
        notes = self.request.get('notes')
        
        self.fractalError = False;
        # validate field
        if not name:
            self.err('name', 'There must be a NAME')
        elif len(name) > 30:
            self.err('name', 'The NAME must contain no more than 30 letters')
        elif Fractal.all().filter('name =', name).fetch(1):
            self.err('name', 'The NAME you chose already exists. Choose another.')

        if not axiom:
            self.err('axiom', 'There must be an INITIAL STRING')
        elif len(axiom) > 50:
            self.err('axiom', 'The INITIAL STRING must contain no more than 50 letters')

        if not rules:
            self.err('rules', 'There must be at least one RULE')
        else:
            splitRules = []
            for rule in rules:
                r = rule.split('=')
                splitRules.append(r[0])
                splitRules.append(r[1])

        if len(author) > 30:
            self.err('author', 'The AUTHOR must contain no more than 30 letters')

        if len(notes) > 160:
            self.err('notes', 'The NOTES must contain no more than 160 letters (think Twitter)')

        try:
            angle = float(angle)
        except:
            self.err('angle', 'The ANGLE must be a number')

        if not self.fractalError:
            fractal = Fractal()
            fractal.name = name
            fractal.axiom = axiom
            fractal.rules = splitRules
            fractal.angle = angle
            fractal.author = author
            fractal.notes = notes
            fractal.put()

        self.response.out.write('</response>')

application = webapp.WSGIApplication(
                                     [('/', MainPage),
                                     ('/submit', FractalSubmit)],
                                     debug=True)
if __name__ == "__main__":
    run_wsgi_app(application)
