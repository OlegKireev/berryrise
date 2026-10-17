import type { ConfigContext, ExpoConfig } from 'expo/config';

// Dev-сборка - отдельное приложение со своим пакетом, чтобы стоять на телефоне рядом с preview.
// APP_VARIANT задает профиль development в eas.json.
const isDev = process.env.APP_VARIANT === 'development';

export default ({ config }: ConfigContext): ExpoConfig => {
  if (!isDev) return config as ExpoConfig;
  return {
    ...config,
    name: `${config.name} dev`,
    scheme: 'berryrise-dev',
    ios: { ...config.ios, bundleIdentifier: 'com.berryrise.app.dev' },
    android: { ...config.android, package: 'com.berryrise.app.dev' },
    // подписи виджетов тоже с dev, иначе в списке виджетов по два одинаковых
    plugins: config.plugins?.map((p) =>
      Array.isArray(p) && p[0] === 'react-native-android-widget'
        ? [
            p[0],
            {
              ...p[1],
              widgets: p[1].widgets.map((w: { label: string }) => ({
                ...w,
                label: `${w.label} dev`,
              })),
            },
          ]
        : p,
    ),
  } as ExpoConfig;
};
