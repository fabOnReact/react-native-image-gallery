# React Native Image Gallery

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Screenshots & Demo

Below are demo GIFs showcasing key functionalities on both iOS and Android.

<!-- Replace these placeholders with your demo GIFs -->

- ![iOS Demo](https://link-to-your-ios-demo.gif)
- ![Android Demo](https://link-to-your-android-demo.gif)
- ![Feature Demo](https://link-to-your-feature-demo.gif)

## Installation

### Prerequisites

- **React Native Environment:** Ensure you have set up your React Native development environment. (See the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide.)
- **Node Version:** This project uses Node.js **v22.13.1**.
- Refer to the [additional instructions](docs/additional_installation_instructions.md) on how to install the project in case of issue during the installation.

### Essential Steps

1. **Create a `.env` File**

In the project root, create a `.env` file and add your Pexels API key:

```sh
PEXELS_API_KEY=your_api_key
```

2. Install the dependencies

```
yarn install
```
or with npm:

```
npm install
```

2.	Start Metro
From the project root, run:
```sh
yarn start
```
or with npm:

```sh
npm start
```

3.	Run the App

Open a new terminal and run one of the following commands:

***Android Instructions:**
```sh
yarn android
```
or with npm:

```
npm run android
```

**iOS Instructions**


The first time you create a new project, run the following commands to install cocoapods dependencies:

```
bundle install
```

Then, every time you update your native dependencies, run:

```
bundle exec pod install
```

Now you can build the project with the command:

```
yarn ios
```
or with npm:

```
npm run ios
```

For additional installation details (such as CocoaPods setup for iOS), please refer to [additional instructions](docs/additional_installation_instructions.md).

### Running Tests

This project uses Jest for testing. To run the tests, execute:

```sh
yarn test
```
or with npm:

```sh
npm run test
```

Note: Console messages are suppressed during tests. To enable logging for debugging, remove the mock on `global.console` in `jest-setup.js`.

### Troubleshooting

If you encounter issues, please refer to the React Native Troubleshooting Guide and also the instructions on how to [Set Up Your Environment](https://github.com/fabOnReact/react-native-image-gallery/blob/readme/docs/additional_installation_instructions.md).
