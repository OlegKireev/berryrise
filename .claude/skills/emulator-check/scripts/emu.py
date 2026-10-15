#!/usr/bin/env python3
"""Проверка приложения "Решено" на Android-эмуляторе. Только stdlib.

python3 .claude/skills/emulator-check/scripts/emu.py <команда> [аргументы]
Команды и примеры - в SKILL.md рядом.
"""

import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PKG = 'dev.olegkireev.quit'
DEEPLINK = 'exp+resheno://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081'
DB = 'files/SQLite/resheno.db'
APK = ROOT / 'android/app/build/outputs/apk/debug/app-debug.apk'
# ponytail: нативное изменение = поменялся один из этих файлов, пересборку можно форсировать up --build
NATIVE_INPUTS = ['package.json', 'app.json', 'yarn.lock', 'eas.json']
NATIVE_HASH = APK.parent / 'native-inputs.sha256'
SDK = Path(os.environ.get('ANDROID_HOME', Path.home() / 'Library/Android/sdk'))
ADB = str(SDK / 'platform-tools/adb')
EMULATOR = str(SDK / 'emulator/emulator')
JAVA17 = '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home'
AVD = os.environ.get('SOBER_AVD', 'Pixel_8')
OUT = Path(os.environ.get('EMU_OUT', Path(tempfile.gettempdir()) / 'sober-emu'))
STATE = OUT / 'state.json'
OUT.mkdir(parents=True, exist_ok=True)


def run(*args, check=True, capture=True, timeout=120, **kw):
    r = subprocess.run(args, capture_output=capture, text=True, timeout=timeout, **kw)
    if check and r.returncode != 0:
        sys.exit(f'{" ".join(map(str, args))}\n{r.stdout}{r.stderr}')
    return r.stdout if capture else ''


def adb(*args, check=True, timeout=60):
    return run(ADB, *args, check=check, timeout=timeout)


def sh(cmd, check=False):
    return adb('shell', cmd, check=check)


def state():
    return json.loads(STATE.read_text()) if STATE.exists() else {}


def save_state(**kw):
    STATE.write_text(json.dumps({**state(), **kw}))


def env():
    e = dict(os.environ, ANDROID_HOME=str(SDK))
    if Path(JAVA17).exists():
        e['JAVA_HOME'] = JAVA17
        e['PATH'] = f'{JAVA17}/bin:{e["PATH"]}'
    return e


def device_ready():
    out = run(ADB, 'devices', check=False)
    return re.search(r'emulator-\d+\s+device', out) is not None


def wait_boot(timeout=240):
    end = time.time() + timeout
    run(ADB, 'wait-for-device', timeout=timeout)
    while time.time() < end:
        booted = sh('getprop sys.boot_completed').strip() == '1'
        # менеджер пакетов поднимается позже флага загрузки
        if booted and 'package:' in sh('pm path android'):
            return
        time.sleep(2)
    sys.exit('эмулятор не загрузился')


def metro_up():
    try:
        return b'running' in urllib.request.urlopen('http://localhost:8081/status', timeout=2).read()
    except OSError:
        return False


# ---------- UI ----------


def nodes():
    xml = adb('exec-out', 'uiautomator', 'dump', '/dev/tty', check=False)
    res = []
    for n in re.findall(r'<node [^>]*>', xml):
        label = _attr(n, 'text') or _attr(n, 'content-desc')
        b = re.findall(r'\d+', _attr(n, 'bounds'))
        if label and len(b) == 4:
            x1, y1, x2, y2 = map(int, b)
            res.append((label, (x1 + x2) // 2, (y1 + y2) // 2))
    return res


def _attr(n, a):
    m = re.search(a + r'="([^"]*)"', n)
    return m.group(1).replace('&#10;', ' ').replace('&quot;', '"').replace('&amp;', '&') if m else ''


def find(text, exact=False, timeout=10):
    end = time.time() + timeout
    while True:
        hits = [n for n in nodes() if (n[0] == text if exact else text in n[0])]
        if hits or time.time() > end:
            return hits
        time.sleep(0.7)


def texts():
    seen, out = set(), []
    for label, *_ in nodes():
        if label not in seen and label not in ('Tools', 'Перейти вверх'):
            seen.add(label)
            out.append(label)
    return out


def tap(text, exact=False, nth=0, timeout=10):
    hits = find(text, exact, timeout)
    if len(hits) <= nth:
        sys.exit(f'не нашел "{text}". На экране: {texts()}')
    _, x, y = hits[nth]
    sh(f'input tap {x} {y}')
    time.sleep(0.8)


def shot(name, full=False):
    path = OUT / f'{name}.png'
    path.write_bytes(subprocess.run([ADB, 'exec-out', 'screencap', '-p'], capture_output=True).stdout)
    if not full:
        # 1080x2400 -> 540x1200: читается так же, а картинка в контексте вчетверо дешевле
        run('sips', '--resampleWidth', '540', str(path), check=False)
    print(path)


def dismiss_dev_ui():
    """Закрывает приветствие dev-меню и само меню, если они открыты."""
    for _ in range(3):
        labels = [n[0] for n in nodes()]
        if 'Continue' in labels:
            tap('Continue', exact=True)
        elif 'Go home' in labels and 'Close' in labels:
            tap('Close', exact=True)
        elif any('isn\'t responding' in label for label in labels):
            tap('Wait', exact=True)
        else:
            return
        time.sleep(0.5)


def launch(wait_for=None):
    sh(f'am force-stop {PKG}')
    adb('reverse', 'tcp:8081', 'tcp:8081')
    adb('logcat', '-c', check=False)
    sh(f'am start -a android.intent.action.VIEW -d "{DEEPLINK}"')
    end = time.time() + 120
    while time.time() < end:
        if 'Running "main"' in adb('logcat', '-d', '-s', 'ReactNativeJS:I', check=False):
            break
        time.sleep(1)
    else:
        sys.exit('JS не запустился за 2 минуты: emu.py logs')
    time.sleep(1.5)
    dismiss_dev_ui()
    if wait_for:
        find(wait_for, timeout=20)


# ---------- данные ----------


def pull_db(tmp):
    sh(f'am force-stop {PKG}')
    for suffix in ('', '-wal', '-shm'):
        data = subprocess.run([ADB, 'exec-out', 'run-as', PKG, 'cat', DB + suffix], capture_output=True).stdout
        if data and b'No such file' not in data[:200]:
            (tmp / f'app.db{suffix}').write_bytes(data)
    if not (tmp / 'app.db').exists():
        sys.exit('базы нет: запусти приложение хотя бы раз (emu.py launch)')
    return tmp / 'app.db'


def sql(statements, write=True):
    with tempfile.TemporaryDirectory() as d:
        db = pull_db(Path(d))
        out = run('sqlite3', '-header', '-column', str(db), statements)
        if write:
            # sqlite3 уже влил WAL в основной файл, на устройстве старый WAL убираем
            run('sqlite3', str(db), 'PRAGMA wal_checkpoint(TRUNCATE);')
            with open(db, 'rb') as f:
                subprocess.run([ADB, 'shell', f"run-as {PKG} sh -c 'cat > {DB}'"], stdin=f, check=True)
            sh(f"run-as {PKG} rm -f {DB}-wal {DB}-shm")
        return out


def ms(dt):
    return int(dt.timestamp() * 1000)


def seed(a):
    from datetime import datetime, timedelta
    import uuid

    now = datetime.now()
    nowms = ms(now)
    start = (now - timedelta(days=a.days)).replace(hour=21, minute=0, second=0, microsecond=0)
    hid = str(uuid.uuid4())
    drinks = json.dumps({k: int(v) for k, v in (p.split('=') for p in a.drinks.split(',') if p)})
    spend = 'NULL' if a.spend is None else a.spend
    cur = 'NULL' if a.spend is None else f"'{a.currency}'"
    q = [
        'DELETE FROM habit; DELETE FROM relapse; DELETE FROM reason; DELETE FROM dayReview; DELETE FROM party;',
        f"INSERT INTO habit (id,createdAt,updatedAt,type,startAt,weeklySpend,currency,drinks) "
        f"VALUES ('{hid}',{nowms},{nowms},'alcohol',{ms(start)},{spend},{cur},'{drinks}');",
    ]
    for d in filter(None, a.relapses.split(',')):
        at = (now - timedelta(days=int(d))).replace(hour=22, minute=0, second=0, microsecond=0)
        q.append(f"INSERT INTO relapse (id,createdAt,updatedAt,habitId,at) VALUES ('{uuid.uuid4()}',{nowms},{nowms},'{hid}',{ms(at)});")
    reasons = [('key', k) for k in filter(None, a.reasons.split(','))] + [('customText', t) for t in a.custom]
    for i, (col, val) in enumerate(reasons):
        val = val.replace("'", "''")
        q.append(f"INSERT INTO reason (id,createdAt,updatedAt,{col},\"order\") VALUES ('{uuid.uuid4()}',{nowms},{nowms},'{val}',{i});")
    for d in filter(None, a.reviews.split(',')):
        date = (now - timedelta(days=int(d))).strftime('%Y-%m-%d')
        q.append(f"INSERT INTO dayReview (id,createdAt,updatedAt,date,mood,craving) VALUES ('{uuid.uuid4()}',{nowms},{nowms},'{date}',3,'none');")
    sql('\n'.join(q))


# ---------- окружение ----------


def native_hash():
    import hashlib

    h = hashlib.sha256()
    for f in NATIVE_INPUTS:
        if not (ROOT / f).exists():
            continue
        data = (ROOT / f).read_bytes()
        if f == 'package.json':
            # скрипты и lint-staged на нативную часть не влияют, считаем только зависимости
            pkg = json.loads(data)
            data = json.dumps([pkg.get(k) for k in ('dependencies', 'devDependencies', 'resolutions')]).encode()
        h.update(data)
    return h.hexdigest()


def native_stale():
    # по содержимому, а не mtime: git checkout и форматирование не должны вызывать сборку
    return not APK.exists() or not NATIVE_HASH.exists() or NATIVE_HASH.read_text() != native_hash()


def install_apk():
    out = adb('install', '-r', '-d', str(APK), check=False, timeout=180)
    if 'UPDATE_INCOMPATIBLE' in out:
        # стоит сборка с другой подписью (preview из EAS): только через удаление, данные эмулятора теряются
        adb('uninstall', PKG, check=False)
        adb('install', str(APK), timeout=180)


def build():
    print('сборка dev build (npx expo run:android --no-bundler)...', flush=True)
    log = OUT / 'build.log'
    with open(log, 'w') as f:
        before = (ROOT / 'package.json').read_text()
        r = subprocess.run(['npx', 'expo', 'run:android', '--no-bundler'], cwd=ROOT, env=env(), stdout=f, stderr=subprocess.STDOUT)
    # prebuild при генерации android/ переписывает скрипты android/ios в package.json, возвращаем
    (ROOT / 'package.json').write_text(before)
    # Gradle daemon держит 2+ ГБ и грузит CPU, эмулятору от этого плохо
    subprocess.run(['./gradlew', '--stop'], cwd=ROOT / 'android', env=env(), capture_output=True)
    if r.returncode != 0 and 'UPDATE_INCOMPATIBLE' in log.read_text():
        install_apk()  # собралось, не встало поверх чужой подписи
    elif r.returncode != 0:
        tail = ''.join(log.read_text().splitlines(True)[-40:])
        sys.exit(f'сборка упала, лог {log}:\n{tail}')
    NATIVE_HASH.write_text(native_hash())


def up(a):
    started = {}
    if not device_ready():
        avd_cfg = Path.home() / f'.android/avd/{AVD}.avd/config.ini'
        if not avd_cfg.exists():
            sys.exit(f'нет AVD {AVD}: создай в Android Studio (образ Google APIs без Play Store) или задай SOBER_AVD')
        p = subprocess.Popen(
            [EMULATOR, '-avd', AVD, '-no-snapshot-save', '-no-audio', '-no-boot-anim'],
            stdout=open(OUT / 'emulator.log', 'w'), stderr=subprocess.STDOUT, start_new_session=True,
        )
        started['emulator'] = p.pid
        print('эмулятор запущен, жду загрузку...', flush=True)
    wait_boot()
    if a.build or native_stale():
        build()  # run:android сам ставит APK
    elif PKG not in sh(f'pm list packages {PKG}') or a.install:
        install_apk()
    sh(f'cmd locale set-app-locales {PKG} --locales {"ru-RU" if a.locale == "ru" else "en-US"}')
    if not metro_up():
        p = subprocess.Popen(
            ['yarn', 'start'], cwd=ROOT, env={**env(), 'CI': '1'},
            stdout=open(OUT / 'metro.log', 'w'), stderr=subprocess.STDOUT, start_new_session=True,
        )
        started['metro'] = p.pid
        for _ in range(60):
            if metro_up():
                break
            time.sleep(1)
        else:
            sys.exit(f'metro не поднялся: {OUT / "metro.log"}')
    save_state(**started)
    launch()
    print('готово. запущено скриптом:', started or 'ничего (эмулятор и metro уже были)')
    print('экран:', texts())


def down(_):
    st = state()
    for name in ('metro', 'emulator'):
        pid = st.get(name)
        if not pid:
            continue
        if name == 'emulator':
            adb('emu', 'kill', check=False)
        try:
            os.killpg(pid, signal.SIGTERM)
            # эмулятор закрывается несколько секунд, ждем, иначе следующий up увидит старый
            for _ in range(15):
                time.sleep(1)
                os.killpg(pid, 0)
            os.killpg(pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        print(f'остановлен {name}')
    if (ROOT / 'android/gradlew').exists():
        subprocess.run(['./gradlew', '--stop'], cwd=ROOT / 'android', env=env(), capture_output=True)
    run(ADB, 'kill-server', check=False)
    STATE.unlink(missing_ok=True)
    print('чужие процессы (metro, эмулятор, запущенные не скриптом) не тронуты')


def set_time(value):
    if value == 'auto':
        sh('settings put global auto_time 1')
        print(sh('date'))
        return
    from datetime import datetime

    dt = datetime.strptime(value, '%Y-%m-%d %H:%M')
    adb('root', check=False)
    time.sleep(1)
    sh('settings put global auto_time 0')
    # toybox date: MMDDhhmmYYYY.ss
    sh(f'date {dt.strftime("%m%d%H%M%Y.00")}')
    print(sh('date').strip(), '- перезапусти приложение (emu.py launch), чтобы JS увидел новое время')


def main():
    import argparse

    p = argparse.ArgumentParser(prog='emu.py')
    s = p.add_subparsers(dest='cmd', required=True)
    c = s.add_parser('up')
    c.add_argument('--build', action='store_true')
    c.add_argument('--install', action='store_true')
    c.add_argument('--locale', default='ru')
    s.add_parser('down')
    c = s.add_parser('launch')
    c.add_argument('--wait')
    s.add_parser('texts')
    c = s.add_parser('tap')
    c.add_argument('text')
    c.add_argument('--exact', action='store_true')
    c.add_argument('--nth', type=int, default=0)
    c = s.add_parser('tapxy')
    c.add_argument('x', type=int)
    c.add_argument('y', type=int)
    c = s.add_parser('wait')
    c.add_argument('text')
    c.add_argument('--timeout', type=int, default=15)
    c = s.add_parser('gone')
    c.add_argument('text')
    c = s.add_parser('type')
    c.add_argument('text')
    c = s.add_parser('key')
    c.add_argument('name', choices=['back', 'enter', 'hide'])
    c = s.add_parser('scroll')
    c.add_argument('dir', choices=['down', 'up'])
    c.add_argument('--times', type=int, default=1)
    c = s.add_parser('shot')
    c.add_argument('name')
    c.add_argument('--full', action='store_true')
    c = s.add_parser('sql')
    c.add_argument('statements')
    c = s.add_parser('query')
    c.add_argument('statements')
    c = s.add_parser('seed')
    c.add_argument('--days', type=int, default=60, help='старт столько дней назад, в 21:00')
    c.add_argument('--relapses', default='', help='дни назад через запятую, срыв в 22:00')
    c.add_argument('--reasons', default='', help='ключи готовых причин: health,sleep,...')
    c.add_argument('--custom', action='append', default=[], help='своя причина, можно несколько раз')
    c.add_argument('--spend', type=int, help='трат в неделю')
    c.add_argument('--currency', default='RUB')
    c.add_argument('--drinks', default='', help='beer=14,wine=2')
    c.add_argument('--reviews', default='', help='итоги дня: дни назад через запятую')
    s.add_parser('reset')
    c = s.add_parser('theme')
    c.add_argument('mode', choices=['dark', 'light'])
    c = s.add_parser('locale')
    c.add_argument('lang', choices=['ru', 'en'])
    c = s.add_parser('time')
    c.add_argument('value', help='"YYYY-MM-DD HH:MM" или auto')
    c = s.add_parser('logs')
    c.add_argument('--all', action='store_true')
    s.add_parser('notifs')
    a = p.parse_args()

    match a.cmd:
        case 'up': up(a)
        case 'down': down(a)
        case 'launch': launch(a.wait); print(texts())
        case 'texts': print(texts())
        case 'tap': tap(a.text, a.exact, a.nth)
        case 'tapxy': sh(f'input tap {a.x} {a.y}'); time.sleep(0.8)
        case 'wait':
            if not find(a.text, timeout=a.timeout):
                sys.exit(f'не дождался "{a.text}". На экране: {texts()}')
        case 'gone':
            if find(a.text, timeout=0):
                sys.exit(f'"{a.text}" все еще на экране')
        case 'type':
            if not a.text.isascii():
                sys.exit('adb input text не умеет кириллицу: заведи данные через seed/sql')
            sh(f"input text '{a.text.replace(' ', '%s')}'")
        case 'key': sh(f'input keyevent {dict(back=4, enter=66, hide=111)[a.name]}'); time.sleep(0.8)
        case 'scroll':
            for _ in range(a.times):
                sh('input swipe 540 1800 540 600 250' if a.dir == 'down' else 'input swipe 540 600 540 1800 250')
            time.sleep(0.6)
        case 'shot': shot(a.name, a.full)
        case 'sql': print(sql(a.statements)); launch(); print(texts())
        case 'query': print(sql(a.statements, write=False))
        case 'seed': seed(a); launch(); print(texts())
        case 'reset':
            sh(f'pm clear {PKG}')
            sh(f'cmd locale set-app-locales {PKG} --locales ru-RU')
            launch()
            print(texts())
        case 'theme': sh(f'cmd uimode night {"yes" if a.mode == "dark" else "no"}'); time.sleep(1.5)
        case 'locale':
            sh(f'cmd locale set-app-locales {PKG} --locales {"ru-RU" if a.lang == "ru" else "en-US"}')
            launch()
        case 'time': set_time(a.value)
        case 'logs':
            spec = [] if a.all else ['-s', 'ReactNativeJS:V', 'ReactNative:W', 'AndroidRuntime:E', 'ExpoModulesCore:W']
            print(''.join(adb('logcat', '-d', *spec, check=False).splitlines(True)[-80:]))
        case 'notifs':
            dump = sh('dumpsys notification --noredact')
            for block in re.findall(rf'NotificationRecord\(.*?pkg={PKG}.*?(?=NotificationRecord\(|\Z)', dump, re.S):
                title = re.search(r'android\.title=String \((.*?)\)', block)
                text = re.search(r'android\.text=String \((.*?)\)', block)
                print('-', title and title.group(1), '|', text and text.group(1))
            alarms = sh(f'dumpsys alarm | grep -c {PKG}').strip()
            print(f'алармов приложения в AlarmManager: {alarms}')


if __name__ == '__main__':
    if not shutil.which('sqlite3'):
        print('нет sqlite3: команды sql/seed/query не заработают', file=sys.stderr)
    main()
