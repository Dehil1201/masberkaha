import ApiLogin from "../api/data-login.js";
import CONFIG from "../config/globals/config.js";
import NotificationModal from "./initial_notification.js";

const Autentication= {
    async isLogin() {
        const result = await this.getData();
        let stateExpired = '';
        result.forEach(data=> {
            stateExpired = data.tanggal;
        });

        if (result.length === 1) {  
            if (!this._isExpiredSession(stateExpired)) {
               return true;
            }  
        }
	},

    _isExpiredSession(state){
        const nowDay = `${new Date().toISOString().slice(0,10)}`;
        if(state !== nowDay){
            this.autoLogout();
            return true
        }
        return false
    },

    async loginUser(dataReceive) {
        const dayLogin = {tanggal : `${new Date().toISOString().slice(0,10)}`};
        const data  =  Object.assign(dataReceive , dayLogin);
        // console.log(data);
        if (this._checkForStorage()) {
            let userData = null;
            if (localStorage.getItem(CONFIG.CACHE_KEY_OTENTIKASI) === null) {
                userData = [];
            } else {
                userData = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY_OTENTIKASI));
            }
      
            userData.unshift(data);
      
            if (userData.length > 1) {
                userData.pop();
            }
      
            localStorage.setItem(CONFIG.CACHE_KEY_OTENTIKASI, JSON.stringify(userData));
        }
    },

    _checkForStorage(){
        return typeof(Storage) !== "undefined";
    },

    async getData(){
        if (this._checkForStorage) {
            return JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY_OTENTIKASI)) || [];
        } else {
            return [];
        }
    },

    autoLogout(){
        localStorage.removeItem(CONFIG.CACHE_KEY_OTENTIKASI);
        window.location.hash = '#/login';
        ApiLogin.Logout();
        NotificationModal.show('Maaf Session Habis , Anda harus login dulu :)','error');
    },

    _logOut(){
        localStorage.removeItem(CONFIG.CACHE_KEY_OTENTIKASI);
        window.location.hash = '#/login';
        ApiLogin.Logout();
    },

    logoutAutentication(){
        localStorage.removeItem(CONFIG.CACHE_KEY_OTENTIKASI);;
        ApiLogin.Logout();
    }
    
}


export default Autentication;
