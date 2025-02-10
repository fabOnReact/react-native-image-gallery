# React Native Image Gallery

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Screenshots & Demo

Below are demo videos showcasing key functionalities on both iOS and Android.

iPhone Gallery and Like Button
<video src="https://github.com/user-attachments/assets/2dda8cb2-8747-44fd-8a6b-7b53c4915278" width="1000" />

iPhone Gallery and Like Button
<video src="https://github.com/user-attachments/assets/2dda8cb2-8747-44fd-8a6b-7b53c4915278" width="1000" />

HeartWithLiquidButton is a custom component that animates the heart icon with liquid effect when the user likes an image. The component is used in the Gallery screen to like an image. More info in the YouTube video below:

https://youtu.be/JlXARcxCoDY

HearthWithLiquidActivityIndicator is an ActivityIndicator that animates the heart icon with liquid effect. The component is used in the Gallery screen to indicate that the images are being loaded. More info in the YouTube video below:

https://youtu.be/2GFf_Z981Zo

The includes support for pinch to zoom, pan, and double-tap to zoom in and out of images. The video below showcases the zoom functionality on both iOS and Android. The app is written in typescript with static typing and includes also jest tests written with react-native-testing-library.

https://youtu.be/eU95lYyO7qM?si=4lmYIYbeNyJ1x1Ab

<details><summary>CLICK TO DISPLAY MORE VIDEOS</summary>
<p>

### iPhone

iPhone Zoom and Like Button
<video src="https://github.com/user-attachments/assets/31c51fd5-20af-41b4-a1f2-9ad3ca97a1f0" width="1000" />

iPhone Favorites Pictures
<video src="https://github.com/user-attachments/assets/6277c567-2706-4abc-9a84-f0a59085df06" width="1000" />

iPhone Position Indicator
<video src="https://github.com/user-attachments/assets/d160e1b2-e6ca-4459-b5aa-05544e70c270" width="1000" />

### Android

Android Gallery, Zoom and Like button

https://github.com/user-attachments/assets/702607ba-aeea-496a-886e-12c4986d029c

</p>
</details>

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

2. Start Metro
   From the project root, run:

```sh
yarn start
```

or with npm:

```sh
npm start
```

3. Run the App

Open a new terminal and run one of the following commands:

**Android Instructions:**

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
