# Mobile App

## Technologies
* [Typescript](http://typescriptlang.org)
* [React Native](https://facebook.github.io/react-native/)

## Requirements

* [node](https://www.nodejs.org/en) 9


## Recommendations

* [vscode](https://code.visualstudio.com)

## macOS Setup

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

3. Install watchman

```bash
brew install watchman
```

4. Install React Native CLI
```bash
npm install react-native-cli -g
```

## Running 

1. Install app dependencies

```bash
cd /path/to/ryden/mobile_app
npm install
```

2. Generate the GraphQL relay schema. TODO(Nadir): bake this into the run app with watch

```bash
npm run relay
```

3. Start app

```bash
npm run start:ios
```
