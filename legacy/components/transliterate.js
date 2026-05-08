var LATIN_TO_CYRILLIC = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з',
  '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о', k: 'л',
  l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь',
  ',': 'б', '.': 'ю', '`': 'ё',
  Q: 'Й', W: 'Ц', E: 'У', R: 'К', T: 'Е', Y: 'Н', U: 'Г', I: 'Ш', O: 'Щ', P: 'З',
  '{': 'Х', '}': 'Ъ', A: 'Ф', S: 'Ы', D: 'В', F: 'А', G: 'П', H: 'Р', J: 'О', K: 'Л',
  L: 'Д', ':': 'Ж', '"': 'Э', Z: 'Я', X: 'Ч', C: 'С', V: 'М', B: 'И', N: 'Т', M: 'Ь',
  '<': 'Б', '>': 'Ю', '~': 'Ё',
};

var SHIFTED_NUMBER_ROW_RU_TO_EN = {
  '"': '@',
  '№': '#',
};

var SHIFTED_NUMBER_ROW_EN_TO_RU = {
  '@': '"',
  '#': '№',
};

var CYRILLIC_TO_LATIN = {};

var latinKeys = Object.keys(LATIN_TO_CYRILLIC);
for (var i = 0; i < latinKeys.length; i += 1) {
  var key = latinKeys[i];
  CYRILLIC_TO_LATIN[LATIN_TO_CYRILLIC[key]] = key;
}

var ruShiftKeys = Object.keys(SHIFTED_NUMBER_ROW_RU_TO_EN);
for (var j = 0; j < ruShiftKeys.length; j += 1) {
  CYRILLIC_TO_LATIN[ruShiftKeys[j]] = SHIFTED_NUMBER_ROW_RU_TO_EN[ruShiftKeys[j]];
}

export function latinToCyrillic(character) {
  if (LATIN_TO_CYRILLIC[character] != null) return LATIN_TO_CYRILLIC[character];
  if (SHIFTED_NUMBER_ROW_EN_TO_RU[character] != null) return SHIFTED_NUMBER_ROW_EN_TO_RU[character];
  return character;
}

export function cyrillicToLatin(character) {
  return CYRILLIC_TO_LATIN[character] != null ? CYRILLIC_TO_LATIN[character] : character;
}

export function transliterateValue(value, direction) {
  var map = direction === 'to-cyrillic' ? LATIN_TO_CYRILLIC : CYRILLIC_TO_LATIN;
  var result = '';
  var input = String(value);

  for (var idx = 0; idx < input.length; idx += 1) {
    var ch = input[idx];
    result += map[ch] != null ? map[ch] : ch;
  }

  return result;
}
