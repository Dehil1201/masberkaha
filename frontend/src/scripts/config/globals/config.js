
const getBase = () => {
  return window.location.origin;
}

const CONFIG = {
  TOKEN: '12345',
  BASE_URL: getBase() + '/masberkaha/backend/',
  BASE_FRONT_URL: getBase() + '/masberkaha/frontend/',
  BASE_IMAGE_URL: getBase() +'/masberkaha/images/',
  BASE_FOTO_URL: getBase() +'/masberkaha/backend/uploads/foto/',
  CACHE_NAME: {
    prefix: '',
    suffix: 'v1',
    precache: 'app-shell',
  },
  CACHE_KEY_OTENTIKASI : 'login-user-sidamas'
};

export default CONFIG;
