
const getBase = () => {
  return window.location.origin;
}

const CONFIG = {
  TOKEN: '12345',
  BASE_URL: getBase() + '/backend/',
  BASE_FRONT_URL: getBase() + '/frontend/',
  BASE_IMAGE_URL: getBase() +'/images/',
  BASE_FOTO_URL: getBase() +'/backend/uploads/foto/',
  CACHE_NAME: {
    prefix: '',
    suffix: 'v1',
    precache: 'app-shell',
  },
  CACHE_KEY_OTENTIKASI : 'login-user-sidamas'
};

export default CONFIG;
