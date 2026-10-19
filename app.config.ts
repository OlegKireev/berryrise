import type { ConfigContext, ExpoConfig } from 'expo/config';

// Dev-сборка - отдельное приложение со своим пакетом, чтобы стоять на телефоне рядом с preview.
// APP_VARIANT задает профиль development в eas.json.
const isDev = process.env.APP_VARIANT === 'development';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const withDevLabel = (w: unknown) =>
  isRecord(w) && typeof w.label === 'string'
    ? { ...w, label: `${w.label} dev` }
    : w;

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  if (!isDev) {
    return config;
  }

  return {
    ...config,
    name: `${config.name} dev`,
    scheme: 'berryrise-dev',
    ios: { ...config.ios, bundleIdentifier: 'com.berryrise.app.dev' },
    android: { ...config.android, package: 'com.berryrise.app.dev' },
    // JS dev-сборке отдает dev-сервер, OTA ей не нужен
    updates: { ...config.updates, enabled: false },
    // подписи виджетов тоже с dev, иначе в списке виджетов по два одинаковых
    plugins: config.plugins?.map((p) => {
      if (!Array.isArray(p) || p[0] !== 'react-native-android-widget') {
        return p;
      }

      const options: unknown = p[1];

      if (!isRecord(options) || !Array.isArray(options.widgets)) {
        return p;
      }

      return [p[0], { ...options, widgets: options.widgets.map(withDevLabel) }];
    }),
  };
};
