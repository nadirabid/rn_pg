# API Server

### Technologies
* [Typescript](http://typescriptlang.org)
* [Koa](http://koajs.com)
* [Typeorm](http://koajs.com)
* [GraphQL](http://graphql.org)


### Requirements

* [node](https://www.nodejs.org/en) 9
* [postgresql](https://www.postgresql.org)

### Recommendations

* [vscode](https://code.visualstudio.com)
* [postico](https://eggerapps.at/postico/)

### macOS Setup

1. Install brew
```bash
xcode-select --install
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install caskroom/cask/brew-cask
```

2. Install node

```bash
brew install node
```

3. Install postgresql

```bash
brew install postgresql
```

4. Setup developement database and user

```bash
psql
```

```sql
CREATE ROLE ryden WITH LOGIN PASSWORD 'ryden';
ALTER USER ryden WITH SUPERUSER;
CREATE DATABASE ryden;
```

### Running

```bash
cd /path/to/ryden/api_server
npm install
npm start
```

### Configuration

> This application follows configuration design principals of a [12 factor application](https://12factor.net).

You'll find the configuration files [here](conf).