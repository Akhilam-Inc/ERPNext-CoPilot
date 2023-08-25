from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in erpnext_copilot/__init__.py
from erpnext_copilot import __version__ as version

setup(
	name="erpnext_copilot",
	version=version,
	description="ERPNext Copilot",
	author="Akhilam INC",
	author_email="raaj@akhilaminc.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
