<p align="center"><img src="src/assets/simplicity-text.png" alt="Simplicity"></p>
<p align="center">
  <a title="Code Style" href="https://www.npmjs.com/package/eslint-config-almeida" target="_blank">
    <img src="https://img.shields.io/badge/code%20style-almeida-brightgreen.svg?style=flat-square" alt="Google">
  </a>
  <a title="Dependencies" href="https://david-dm.org/Simplicity/Simplicity/" target="_blank">
    <img src="https://david-dm.org/Simplicity/Simplicity.svg?style=flat-square" alt="Dependencies">
  </a>
  <a title="Library" target="_blank" href="https://discord.js.org/#/">
    <img src="https://img.shields.io/badge/library-discord.js-blue.svg?style=flat-square" alt="discord.js">
  </a>
  <a title="Code Quality" href="https://www.codacy.com/app/Simplicity/Simplicity?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Simplicity/Simplicity&amp;utm_campaign=Badge_Grade" target="_blank">
    <img src="https://img.shields.io/codacy/grade/4f29cb30be614ad3a5af1fa381efa9f7.svg?style=flat-square" alt="Code Quality" />
  </a>
  <a title="License" href="https://github.com/Simplicity/Simplicity/blob/dev/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/Simplicity/Simplicity?style=flat-square" alt="License"/>
  </a>
</p>

** **

# Table of Contents

- [Overview](#overview)
- [Basic Setup Instructions](#basic-setup-instructions)
  - [Git Instructions](#git-instructions)
    - [Configuring Git](#configuring-git)
    - [Cloning the Repository](#cloning-the-repository)
  - [Server Instructions](#server-instructions)
    - [Installing the Bot](#installing-the-bot)
    - [Configuring the Bot](#configuring-the-bot)
    - [Running the Bot](#running-the-bot)
- [Contributors](#contributors)

** **

### Overview

This repository houses the Simplicity Discord bot on the master version of the DiscordJS Library.

### Basic Setup Instructions

This information will be relevant to users who are unfamiliar with standard Git and or Bot Practices and setup. Should you run into any issues, ask the current team, or if they are unsure, ask the latest team of Contributors.

#### Git Instructions

##### Configuring Git

- `git config user.name "Name"`
- `git config user.email "your@email.com"`

##### Cloning the Repository

- `git clone https://github.com/Simplicity/Simplicity.git`
- `cd Simplicity`

#### Server Instructions

##### Installing the Bot

- Install NVM
  - Windows: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
  - Linux: `curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash`
- `git clone https://github.com/Simplicity/Simplicity.git`
- `cd Simplicity`
- `nvm install 12.4.0`
- `nvm use 12.4.0`
- Install Yarn
  - Windows:
    - Install Chocolatey: [installation guide](https://chocolatey.org/docs/installation#installing-chocolatey)
    - `choco install yarn --ignore-dependencies`
  - Linux:
    - `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
    - `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
    - `sudo apt update && sudo apt install --no-install-recommends yarn`
- `yarn install`

##### Configuring the Bot

- Copy the .env.example file and rename it into .env
  - Windows: `copy .env.example .env`
  - Linux: `cp .env.example .env`
- Open the .env file and insert the appropriate credentials

##### Running the Bot

- `yarn start`

** **

### Contributors

<div id="v1">
  <img src="https://avatars1.githubusercontent.com/u/42935195?v=4&size=20" style="vertical-align:bottom;">
  <a href="https://github.com/Almeeida"><code>Almeeida</code></a><span> - </span>

  <img src="https://avatars2.githubusercontent.com/u/27602189?v=4&size=20" style="vertical-align:bottom;">
  <a href="https://github.com/Tsugami"><code>Tsugami</code></a>
</div>
