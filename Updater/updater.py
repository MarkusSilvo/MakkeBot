import os
import subprocess
import urllib
import urllib.request
import zipfile
import psutil
from logger import Logger
from version import Version
from settings import Settings

class Updater:

	def __init__(self, cfg):
		self.workingDirectory = cfg.dir
		self.updateZipFile = 'master.zip'

	def load_current_version(self):
		for line in open(self.workingDirectory + '/package.json').readlines():
			if line.find('version') != -1:
				return line

		Logger().write('Failed to parse version string.')
		return None

	def check_update(self):
		# Get current bot version.
		currentVersion = Version(self.load_current_version())

		Logger().write('Checking update...')
		lines = urllib.request.urlopen('https://raw.githubusercontent.com/MarkusSilvo/MakkeBot/master/package.json').readlines()

		githubVersion = None

		for line in lines:
			decodedLine = line.decode('utf-8')
			if decodedLine.find('version') != -1:
				githubVersion = Version(decodedLine)
				break

		if githubVersion == None:
			Logger().write('Github version was None.')
			return False

		return currentVersion.compare(githubVersion)

	def start_update_process(self):
		log = Logger()
		log.write('New update found! Starting to update...')

		log.write('Loading update...')
		# Load update as zip.
		self.download_master_zip()

		log.write('Killing bot process...')
		# Kill bot process.
		self.kill_bot_process()

		log.write('Extracting update zip archive...')
		# Extract update zip
		self.extract_master_zip()

		log.write('Running npm install...')
		# Run npm install
		self.run_npm_install()

		log.write('Removing update zip archive...')
		self.delete_master_zip()

		log.write('Starting bot process...')
		# Start bot process
		self.start_bot_node_js()

	def start_bot_node_js(self):
		subprocess.Popen('node bot.js', cwd=self.workingDirectory, shell=True)

	def download_master_zip(self):
		fileData = urllib.request.urlopen('https://github.com/MarkusSilvo/MakkeBot/archive/' + self.updateZipFile).read()
		f = open(self.updateZipFile, 'wb')
		f.write(fileData)
		f.close()

	def extract_master_zip(self):
		# Zip file doesn't exist
		if not os.path.exists(self.updateZipFile):
			return

		archive = zipfile.ZipFile(self.updateZipFile, 'r')
		for obj in archive.namelist():
			name = obj.split('MakkeBot-master/')[1]
			if (len(name) == 0 or name.startswith('.')):
				continue

			# Don't extract Updater stuff.
			if 'Updater' in name:
				continue

			# It's an directory, create it if it doesn't exist.
			if (name.endswith('/')):
				dirName = self.workingDirectory + '/' + name[:-1]
				if not os.path.isdir(dirName):
					os.makedirs(dirName)
				continue
			
			zipF = archive.open(obj).read()
			f = open(self.workingDirectory + '/' + name, 'wb')
			f.write(zipF)
			f.close()

	def delete_master_zip(self):
		if os.path.exists(self.updateZipFile):
			os.remove(self.updateZipFile)

	def run_npm_install(self):
		subprocess.call(['npm', 'install'], shell=True, cwd=self.workingDirectory)

	def get_process_pid(self, processName):
		for proc in psutil.process_iter():
			if processName in proc.name():
				return proc.pid
		return None

	def get_node_processes(self):
		node_processes = []
		for proc in psutil.process_iter():
			if 'node' in proc.name():
				node_processes.append(proc.pid)

		return node_processes

	def kill_bot_process(self):
		for pid in self.get_node_processes():
			os.kill(pid, -9)
			Logger().write('Process with ID: ' + str(pid) + ' killed!')
