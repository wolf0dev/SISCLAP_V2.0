/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/forgot-password` | `/(auth)/forgot-username` | `/(auth)/login` | `/(auth)/register` | `/(tabs)` | `/(tabs)/` | `/(tabs)/beneficiarios` | `/(tabs)/beneficiarios-inactivos` | `/(tabs)/profile` | `/(tabs)/reportes` | `/_sitemap` | `/beneficiarios` | `/beneficiarios-inactivos` | `/forgot-password` | `/forgot-username` | `/login` | `/profile` | `/register` | `/reportes`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
