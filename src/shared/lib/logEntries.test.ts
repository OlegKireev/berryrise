import assert from 'node:assert/strict';

import { entryLine, parseLog, trimLines } from './logEntries';

test('parseLog: свежие первыми, битые строки пропускаются', () => {
  const text = [
    entryLine('info', 'widget', 'UPDATE Streak 12'),
    '{"at":1,"level":"error","tag":"glo\n', // оборвано при падении
    entryLine('error', 'global', 'boom', 'at foo\nat bar'),
  ].join('');
  const entries = parseLog(text);

  assert.deepEqual(
    entries.map((e) => e.msg),
    ['boom', 'UPDATE Streak 12'],
  );
  assert.equal(entries[0]?.stack, 'at foo\nat bar');
  assert.equal(entries[1]?.stack, undefined);
});

test('parseLog: пустой файл', () => {
  assert.deepEqual(parseLog(''), []);
});

test('entryLine: длинный стек обрезается', () => {
  const [entry] = parseLog(entryLine('error', 'render', 'x', 'a'.repeat(5000)));
  assert.equal(entry?.stack?.length, 4000);
});

test('trimLines: оставляет хвост, null если обрезать нечего', () => {
  assert.equal(trimLines('a\nb\nc\n', 2), 'b\nc\n');
  assert.equal(trimLines('a\nb\n', 2), null);
});
