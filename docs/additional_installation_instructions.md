# Additional Installation Instructions

If you need more detailed setup instructions, please follow the steps below.

## Setting Up Your Environment

1. **React Native CLI and Dependencies**

   - Follow the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide.
   - Verify you have the required tools (e.g., Node.js **v22.13.1**, Watchman, Java JDK, etc.).

2. **iOS Specific Instructions**

   - **Install CocoaPods Dependencies**

     The first time you create a new project, run:

     ```sh
     bundle install
     ```

     Then, every time you update your native dependencies, run:

     ```sh
     bundle exec pod install
     ```

   - For more detailed CocoaPods instructions, see the [CocoaPods Getting Started Guide](https://guides.cocoapods.org/using/getting-started.html).

3. **Android Specific Instructions**

   - Ensure that you have Android Studio installed and configured properly.
   - Verify that the Android SDK and related tools are set up.

## Running the Metro Bundler

Start the Metro server by running:

```sh
yarn start

This command should be executed from the project root.

Building and Running the App

With Metro running, you can build and run the app using:
	•	Android:

yarn android


	•	iOS:

yarn ios



	Note: You can also build and run the app directly from Android Studio or Xcode if preferred.

Final Notes
	•	This project assumes you already have a fully set up React Native environment.
	•	For further guidance, refer to the official React Native documentation.
```
