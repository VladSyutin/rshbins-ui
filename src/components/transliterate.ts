const LATIN_TO_CYRILLIC: Record<string, string> = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з',
  '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о', k: 'л',
  l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь',
  ',': 'б', '.': 'ю', '`': 'ё',
  Q: 'Й', W: 'Ц', E: 'У', R: 'К', T: 'Е', Y: 'Н', U: 'Г', I: 'Ш', O: 'Щ', P: 'З',
  '{': 'Х', '}': 'Ъ', A: 'Ф', S: 'Ы', D: 'В', F: 'А', G: 'П', H: 'Р', J: 'О', K: 'Л',
  L: 'Д', ':': 'Ж', '"': 'Э', Z: 'Я', X: 'Ч', C: 'С', V: 'М', B: 'И', N: 'Т', M: 'Ь',
  '<': 'Б', '>': 'Ю', '~': 'Ё',
};

const SHIFTED_NUMBER_ROW_RU_TO_EN: Record<string, string> = {
  '"': '@',
  '№': '#',
};

const SHIFTED_NUMBER_ROW_EN_TO_RU: Record<string, string> = {
  '@': '"',
  '#': '№',
};

const CYRILLIC_TO_LATIN: Record<string, string> = {};

for (const [latin, cyrillic] of Object.entries(LATIN_TO_CYRILLIC)) {
  CYRILLIC_TO_LATIN[cyrillic] = latin;
}

for (const [ru, en] of Object.entries(SHIFTED_NUMBER_ROW_RU_TO_EN)) {
  CYRILLIC_TO_LATIN[ru] = en;
}

export function latinToCyrillic(character: string): string {
  return LATIN_TO_CYRILLIC[character] ?? SHIFTED_NUMBER_ROW_EN_TO_RU[character] ?? character;
}

export function cyrillicToLatin(character: string): string {
  return CYRILLIC_TO_LATIN[character] ?? character;
}

export function transliterateValue(value: string, direction: 'to-cyrillic' | 'to-latin'): string {
  const map = direction === 'to-cyrillic' ? LATIN_TO_CYRILLIC : CYRILLIC_TO_LATIN;
  let result = '';

  for (const character of value) {
    result += map[character] ?? character;
  }

  return result;
}
