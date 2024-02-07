import { getHours, getMinutes } from 'date-fns';

export const pluralWords = {
  seats: ['место', 'места', 'мест'],
  passengers: ['пассажира', 'пассажиров', 'пассажиров'],
  children: ['ребёнка', 'детей', 'детей'],
  adultPassengers: ['Взрослый', 'Взрослых', 'Взрослых'],
  childPassengers: ['Ребёнок', 'Ребёнка', 'Детей'],
  hours: ['час', 'часа', 'часов'],
  minutes: ['минута', 'минуты', 'минут'],
};

export const getTwoDigitNumber = (number) => {
  return number < 10 ? `0${number}` : number;
};

export const formatDateToHM = (date) => {
  const hours = getHours(date);
  const minutes = getMinutes(date);
  return `${getTwoDigitNumber(hours)}:${getTwoDigitNumber(minutes)}`;
};

export const formatNumber = (number) => {
  let stringNumber = number.toString();
  if (stringNumber.includes('.')) {
    stringNumber.replace('.', ',');
    if (stringNumber.match(/\.\d$/)) {
      stringNumber = `${stringNumber}0`;
    }
  }
  return stringNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};


/**
 * Pluralize russian words
 * @param {Number} count quantity for word
 * @param {Array.<string[]>} declarations array of words [одна, две, пять]
 * @param {String} [zeroDeclaration] declaration for zero quantity
 * @example plural(4, ['пересадка', 'пересадки', 'пересадок'], 'Без пересадок')
 * @returns {String} count + plural form for word
 */

export const getPlural = (count, declarations, zeroDeclaration) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return zeroDeclaration && !count
    ? zeroDeclaration
    : `${count} ${
        declarations[
          count % 100 > 4 && count % 100 < 20
            ? 2
            : cases[Math.min(count % 10, 5)]
        ]
      }`;
};
