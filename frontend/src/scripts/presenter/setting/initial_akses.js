import apiRuleUser from '../../api/data-rule-user.js';
import apiUser from '../../api/data-user.js';

const aksesInitiator = {

	async init() {
		document.getElementById('list-type-user').focus();
        await this._showJenisUser();
		await this._eventShowRoleAkses();
    },
    async _showJenisUser() {
        let elmData = '';
		const dataAkses = await apiUser.getAksesUser();
		dataAkses.forEach(data => {
			elmData += `<option value="${data.level}">${data.level}</li>`;
        });
        
		$("#list-type-user").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Pilih Jenis User -- </option>' + elmData);
    },

	async _eventShowRoleAkses() {
		
        const eventRole = async () => {
			const levelValue =  document.getElementById('list-type-user').value;
			const dataRole = await apiRuleUser.getListRuleAkses(levelValue);
			await this._renderRoleAkses(dataRole);
			this._giveEventChangeBox(dataRole);
		}
		document.getElementById('list-type-user').addEventListener('change',eventRole);
	},

	async _renderRoleAkses(dataRole) {
		let elmHtml = ``;
		let elmHtmlForDashboard = '';
		let isDashboard = 'DASHBOARD';
		let stateChecked = '';
		for (const property in dataRole) {
			if(dataRole[property] === '1'){
				  stateChecked = 'checked = checked';
			  } else {
				  stateChecked = '';
			  }

			  if ( property.toUpperCase().indexOf(isDashboard) > -1) {
			  elmHtmlForDashboard += `<div class="col 6 mt-3">
			  <div class="form-check">
					  <input class="form-check-input" type="checkbox" value="${property}" id="access-${property}" ${stateChecked}>
					  <label class="form-check-label" for="access-${property}">
						  ${property}
					  </label>
			  </div>
		 	 </div>` 
				}
			 
			  
			  if ( (property != 'id') && (property != 'level') && ( property.toUpperCase().indexOf(isDashboard) <= -1) ) {
				  elmHtml += `<div class="col 6 mt-3">
				  <div class="form-check">
						  <input class="form-check-input" type="checkbox" value="${property}" id="access-${property}" ${stateChecked}>
						  <label class="form-check-label" for="access-${property}">
							  ${property}
						  </label>
				  </div>
			  </div>`
			  }
		  }	
	  document.getElementById('roleAkses').innerHTML = `<div class="row row-cols-3"> ${elmHtml} </div>`;
	  document.getElementById('roleDashboard').innerHTML = `<div class="row row-cols-3"> ${elmHtmlForDashboard} </div>`;

	},

	_giveEventChangeBox(dataRole) {
			
			for (const property in dataRole) {
				if ((property != 'id') && (property != 'level')) {
					const dataElm = document.getElementById('access-'+property);
					dataElm.addEventListener( 'click', async ()=> {
						const valueChecked = dataElm.checked ? 1: 0;
						const fieldType = dataElm.value;
						const userType = document.getElementById('list-type-user').value;
						const result = await apiRuleUser.update({
								level: userType,
								field: fieldType,
								value: valueChecked,
							});
						console.log(result ? 'update berhasil' : 'success');
					});
				}
			}
		
	},

	
}




export default aksesInitiator;
