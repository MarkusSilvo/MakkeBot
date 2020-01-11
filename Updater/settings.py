import json

class Settings:

	def __init__(self):
		self.dir = None

	def to_file(self):
		f = open('settings.json', 'w')
		f.write(json.dumps(self.__dict__))
		f.close()
		return self

	def from_file(self):
		f = open('settings.json', 'r')
		js = json.loads(f.read())
		f.close()
		self.dir = js['dir']
		return self