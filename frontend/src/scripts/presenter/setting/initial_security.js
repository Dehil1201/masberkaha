import apiRuleUser from '../../api/data-rule-user.js';
import apiUser from '../../api/data-user.js'
const SecurityRule = {

	async initRuleDashboard(elmId) {
		this._idLevelDashboard = document.getElementById('level-user').value;
		this._levelUserDashboard = await this._getLevel(this._idLevelDashboard);
		this._stateView = elmId;
		this._data = await apiRuleUser.getListRuleAkses(this._levelUserDashboard);
		const result = await this._autentication(this._stateView);
		if (result === false) {
			this._hideElement(elmId);
		}

		return true;
	},

	async _hideElement(elmId) {
		document.getElementById(`${elmId}`).classList.add("d-none");
	},

	async init({
		statePage
	}) {
		this._idLevel = document.getElementById('level-user').value;
		this._levelUser = await this._getLevel(this._idLevel);
		this._statePage = statePage;
		this._data = await apiRuleUser.getListRuleAkses(this._levelUser);
		const result = await this._autentication(this._statePage);
		if (result === false) {
			this._renderNotAccess();
		}
	},

	async _getLevel(idLevel) {
		let result = '';
		const dataAkses = await apiUser.getAksesUser();
		dataAkses.filter((data) => data.id === idLevel).map((filtered) => {
			result = filtered.level;
		});
		return result;
	},

	async _autentication(state) {
		if (this._data[state] === '1') {
			return true;
		} else {
			return false;
		}
	},

	_renderNotAccess() {
		window.location.hash = '#/500';
	}

}

export default SecurityRule;
