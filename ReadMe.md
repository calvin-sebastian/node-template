# NODE-TEMPLATE

A re-usable template for express backends

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Use the repository as a template:
   at the top of this page, click on the button labelled `Use this template`

2. Setup your .env file and database or use the default configuration scripts listed below. See [Configuration](#configuration) for details.

3. Download dependancies and run:
   `npm run dev`

4. or install packages manually and run:
   `npm install`
   `npm start`

## Usage

- This template is designed as a starting point to encourage uniformity across node backends.

- The full functionality of this repo requires mysql being installed beforehand.

- The alt. start up scripts will initialize an env file, a database and 2 tables: one for users and one for permissions.

- The backend can be used without the optional scripts, however, the user queries are dependant on these tables and will not function properly without them.

## Configuration

The backend can be set up manually by configuring your own .env file and setting up your database beforehand or alternate scripts are listed below for using the default configuration:

1. Initialize the env file (Optional):
   `npm run init-env`

2. Initialize the test database (Optional):
   `npm run init-db` (change the DB_NAME in the .env file to desired name before running this script)

3. Initialize the user and permissions tables (Optional):
   `npm run init-tables` (change the databaseTables variable in the initialize-tables.js file to desired table configurations before running this script)

4. Download dependancies and run
   `npm run dev`

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

- Fork the Project

- Create your Feature Branch (git checkout -b feature/AmazingFeature)

- Commit your Changes (git commit -m 'Add some AmazingFeature')

- Push to the Branch (git push origin feature/AmazingFeature)

- Open a Pull Request

## License

Distributed under the MIT License. See LICENSE.txt for more information.
