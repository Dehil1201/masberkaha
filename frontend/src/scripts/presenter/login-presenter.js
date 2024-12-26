import ApiLogin from "../api/data-login.js";
import Autentication from "../utils/autentication.js";
import NotificationModal from "../utils/initial_notification.js";

const LoginInitiator = {

	async init() {
		await this._setView();
		await this._giveEvent();
	},

	async _setView() {
		document.getElementById('username').focus();
		document.getElementById('main-content').classList.add('bg-gradient-primary');
		document.getElementById("main-content").style.height = "100vh";
		document.getElementById("main-content").style.paddingTop = "20px";
		document.getElementById('appbar').classList.add('d-none')
		document.getElementById('accordionSidebar').classList.add('d-none')

	},

	async _syncView() {
		document.getElementById('main-content').classList.remove('bg-gradient-primary');
		document.getElementById('main-content').style.removeProperty("height");
		document.getElementById('main-content').style.removeProperty("padding-top");
		document.getElementById('appbar').classList.remove('d-none');
		document.getElementById('accordionSidebar').classList.remove('d-none');
		window.location.hash = '#/dashboard';
	},

	async _giveEvent() {
		const eventLogin = async (e) => {
			document.getElementById("btnLogin").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>`
			e.preventDefault();
			const isLogin = await ApiLogin.Login({
				username: document.getElementById('username').value,
				password: document.getElementById('password').value,
			});

			if (isLogin.status == false) {
				NotificationModal.show('Username tidak ditemukan!', 'error');
				document.getElementById("btnLogin").innerHTML = `Login`;
			} else {
				if (isLogin.aunteticated === true || isLogin.status === 'MASUK') {
					let dataUser = {
						id: `${isLogin.userID}`,
						level: `${isLogin.levelID}`,
						name: `${isLogin.nama}`,
						username: `${isLogin.username}`,
						aunteticated: `${isLogin.authenticated}`,
						login: '1'
					}
					await Autentication.loginUser(dataUser);
					const datas = await Autentication.getData();

					datas.forEach(data => {
						document.querySelector('app-bar').setName = data;
					});
					document.getElementById("btnLogin").innerHTML = `Login`;
					this._syncView();
				} else {
					NotificationModal.show('Password Salah', 'error');
					document.getElementById("btnLogin").innerHTML = `Login`;
				}
			}
		}
		document.getElementById('login-user').addEventListener('submit', eventLogin);
	}

}

export default LoginInitiator;
