/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/beneficiarios` | `/(tabs)/profile` | `/(tabs)/reportes` | `/_sitemap` | `/beneficiarios` | `/profile` | `/reportes`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
