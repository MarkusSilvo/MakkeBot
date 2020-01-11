class Version:

	# major.minor.build
	def __init__(self, versionString: str):
		self.versionString = versionString
		self.major = 0
		self.minor = 0
		self.build = 0
		self.parse()

	def parse(self):
		splitted = self.parse_version_str().split('.')
		self.major = int(splitted[0])
		self.minor = int(splitted[1])
		self.build = int(splitted[2])

	# Version string comes from file as "version": "1.0.0",\n
	# So lets parse all those useless chars away.
	#
	# There is probably some way to parse json but idk
	# @TODO: Parse json maybe sometime
	def parse_version_str(self):
		return self.versionString.split('": ')[1].split('"')[1].split('"')[0]
	
	# Compares two version objects.
	# Returns True, if other version is newer; otherwise False.
	def compare(self, other):
		# Versions are same.
		if self.major == other.major and self.minor == other.minor and self.build == other.build:
			return False
		
		# Other version is newer.
		if other.major > self.major or other.minor > self.minor or other.build > self.build:
			return True

		# Current version is newer.
		return False

	# Get current version as major.minor.build
	def to_string(self):
		return str(self.major) + '.' + str(self.minor) + '.' + str(self.build)
