
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiRuleUser {
	static async getListRuleAkses(level) {
        try {
            const myHeaders = new Headers();
            const formdata = new FormData();
            formdata.append("level", `${level}`);
           
           const response = await fetch(API_ENDPOINT.LIST_RULE_AKSES, {
               method: 'POST',
               headers: myHeaders,
               body: formdata,
               redirect: 'follow'
           });
           return response.json();
        } catch (error) {
            Autentication.autoLogout();
        }
    
	}

	static async update({level , field , value }) {
        try {
            const myHeaders = new Headers();
            const formdata = new FormData();
    
            formdata.append("level", `${level}`);
            formdata.append("field", `${field}`);
            formdata.append("value", `${value}`);
           
           const response = await fetch(API_ENDPOINT.UPDATE_RULE_USER, {
               method: 'POST',
               headers: myHeaders,
               body: formdata,
               redirect: 'follow'
           });
           return response.json(); 
        } catch (error) {
            Autentication.autoLogout();
        }
        
	}

}

export default ApiRuleUser;
