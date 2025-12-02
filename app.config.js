import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "framez",
    slug: "framez",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "framez",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      // These are your environment variables for Supabase
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "b4b289ea-b213-42e2-a999-b0ea74c13ed0"
      }
    },
    ios: {
      bundleIdentifier: "com.larrydaves.framez",
      supportsTablet: true
    },
    android: {
      package: "com.larrydaves.framez",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static"
    },
    plugins: [
      "expo-router",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
});