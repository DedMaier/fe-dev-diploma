export const patternValues = {
  onlyCyrillic: /^[а-яё]+$/i,
  birthCertificate: /^[ivx]{1,4}[\s-]?[а-я]{2}[\s-]?[\d]{6}$/i,
  phone: /^(\+7|8)[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/i,
  // регулярка на email откуда-то скопирована
  email:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i,
};

export const errorMessages = {
  required: (field) => `Поле «${field}» обязательно для заполнения`,
  onlyCyrillic: (field, gender) => {
    return `${field} ${(() => {
      switch (gender) {
        case 'male':
          return 'должен';
        case 'female':
          return 'должна';
        default:
          return 'должно';
      }
    })()} содержать только буквы русского алфавита`;
  },
};
