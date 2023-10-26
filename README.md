# EngineerStudy (Hose Quiz)
## An online tool for learning fire apparatus pumping math and facts.

### Table of Contents
- [Introduction](#introduction)
- [Bug Reports and Suggested Enhancements](#bug-reports-and-suggested-enhancements)
- [Contributing to This Web Site](#Contributing-to-this-web-site)
- [Authors](#authors)
- [Version History](#version-history)

### Introduction
#### What is this?
This is the code repository for [Hose Quiz](https://www.unboxedmind.com/engineerstudy/), a web-based quiz application for firefighters to learn and practice quickly solving fireground pumping scenarios.

#### How do I use the application?
Visit [https://www.unboxedmind.com/engineerstudy/](https://www.unboxedmind.com/engineerstudy/) and work through any of the several quizzes offered by the application. It presently can drill you on:
- Basic, low-level facts (nozzle flow rates and hose / appliance friction losses)
- Simple, starting configurations of hose + nozzles for memorization
- More realistic, dynamically generated scenarios involving varying deployments of hose, nozzles, and other water delivery components (standpipes, and so on).

#### What numbers are being used here? Do they apply everywhere?
This has two answers:
- Basic facts, such as nozzle flow rates and friction losses, are not unique to a particular fire department, so they should be widely applicable.
- Specific configurations tested here are presently based on the hose loads and equipment carried by the [Glen Ellyn Volunteer Fire Company](https://gefirerecruit.com/), and these obviously won't exactly match what is on other departments' rigs. That also means certain common but department-specific items aren't currently included, such as 4" hose. *However*, this is intentionally an open-source application, allowing either for others to build customized versions or for this one to be expanded over time.

## Bug Reports and Suggested Enhancements
- For bug reports and suggested enhancements, visit [https://github.com/trajanmcgill/EngineerStudy/issues](https://github.com/trajanmcgill/EngineerStudy/issues).

## Contributing to this web site
- Prerequisites
    - [git](https://git-scm.com/)
    - [npm](https://www.npmjs.com/)
- Setup
	1. First, fork this project and then `git clone` from GitHub:
	2. Next, to get all the dependencies, move inside the newly created project directory and run `npm install`.
- Components used:
	- `vue` for marrying controls and display to data views and operation.
	- `jquery terminal` for the command-line-style interface.
	- `jquery` only because jquery terminal requires it.
    - `vite` for building the application.
- Running / Building:
    - This project is built using [vite](https://vitejs.dev/).
    - After cloning the repository, move to the project directory and run:
	    ```
	    npm install
	    ```
	    This will get all the pieces installed.
	- To test locally:
		```
		npm run dev
		```
	- To build for production:
		```
		npm run build
		```
		But note that because vite doesn't play nicely with non-module-based JavaScript files (such as jquery terminal), the build script has a file copy step to move jquery and jquery terminal into the right location, which will currently only work on Linux.
	
## Authors
[Trajan McGill](https://github.com/trajanmcgill)

## Version History
See [releases page](https://github.com/trajanmcgill/EngineerStudy/releases) for version notes and downloadable assets.
