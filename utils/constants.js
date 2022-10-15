const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;
const ERROR_MESSAGE = {
  INTERNAL_SERVER_ERROR: 'ошибка по-умолчанию',
  CREATE_USER_ERROR: 'Переданы некорректные данные в методы создания пользователя',
  CREATE_CARDS_ERROR: 'Переданы некорректные данные в методы создания карточки',
  PATCH_BAD_REQUEST: 'Переданы некорректные данные в методы обновления профиля.',
  NOT_FOUND_USERID: 'Пользователь по данному _id не найден.',
  NOT_FOUND_CARDSID: 'Карточка по данному _id не найдена',
  LIKE_CARDID_DATA_ERROR: 'Переданы некорректные данные в методы постановки или снятия лайка',
};

module.exports = {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  ERROR_MESSAGE,
};
