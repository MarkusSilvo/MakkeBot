'''
	Updater application for MakkeBot
	Version: 0.0.1
	Author: JokkeeZ
'''
import os
import time
import json
from logger import Logger
from updater import Updater
from version import Version
from settings import Settings

# Main method
def run_updater(updater):
	while True:
		# Run update check.
		if updater.check_update():
			updater.start_update_process()

		# Check updates every 30 sec.
		time.sleep(30)

def create_settings_file(workingDirectory):
	settings = Settings()
	settings.dir = workingDirectory
	# Write settings to an file.
	return settings.to_file()

def load_settings_file():
	return Settings().from_file()

def initialize_settings():
	# Settings file already exists.
	if os.path.isfile('settings.json'):
		return load_settings_file()

	# Get working directory from user input.
	workingDirectory = input('Enter path to bot.js directory: ')

	# Trim ending '/' incase user input has it.
	if workingDirectory.endswith('/'):
		workingDirectory = workingDirectory[:-1]

	# If given string is not existing directory
	if not os.path.isdir(workingDirectory):
		Logger().write('Working directory doesn\'t exist!')
		return None

	# If package.json doesn't exist in the given directory
	if not os.path.isfile(workingDirectory + '/package.json'):
		Logger().write('package.json not found in path: ' + workingDirectory + '/package.json')
		return None

	return create_settings_file(workingDirectory)


def main():
	# Load or create settings incase it doesn't exist.
	settings = initialize_settings()
	if settings is None or settings.dir is None:
		Logger().write('Failed to load settings.')
		return

	# Create new updater instance.
	updater = Updater(settings)
	# Kill already running bot process.
	updater.kill_bot_process()
	# Start new bot process.
	updater.start_bot_node_js()
	# Run updater.
	run_updater(updater)

if __name__ == "__main__":
	main()
