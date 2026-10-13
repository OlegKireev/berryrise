/**
 * Локальный Yarn-плагин: устанавливает git-хуки lefthook после `yarn install`.
 *
 * Зачем: Yarn Berry не запускает lifecycle-скрипт `prepare`, а `.yarnrc.yml`
 * с `enableScripts: false` отключает postinstall npm-пакета lefthook. Хук
 * Yarn `afterAllInstalled` — часть самого Yarn (не build-скрипт зависимости),
 * поэтому выполняется в обход этих ограничений и разворачивает хуки у каждого
 * разработчика при установке зависимостей / после клонирования репозитория.
 */
module.exports = {
  name: `plugin-lefthook`,
  factory: (require) => {
    const { execFileSync } = require(`child_process`);
    const fs = require(`fs`);
    const path = require(`path`);

    return {
      hooks: {
        afterAllInstalled(project) {
          // В CI git-хуки не нужны (и lefthook сам пропускает install при CI=true).
          if (process.env.CI) return;

          const cwd = String(project.cwd);
          const lefthookBin = path.join(
            cwd,
            `node_modules`,
            `lefthook`,
            `bin`,
            `index.js`,
          );

          // lefthook может быть ещё не установлен (например, первый проход) — тихо выходим.
          if (!fs.existsSync(lefthookBin)) return;

          try {
            execFileSync(process.execPath, [lefthookBin, `install`], {
              cwd,
              stdio: `inherit`,
            });
          } catch (err) {
            console.warn(
              `[plugin-lefthook] не удалось установить git-хуки: ${err.message}`,
            );
          }
        },
      },
    };
  },
};
