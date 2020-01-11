class Logger:

	def __init__(self):
		self.name = 'UPDATER'

	def write(self, text):
		print('[' + self.name + '] ' + text)
