import ApiSettingApps from '../../api/data-setting-apps.js';
import API_ENDPOINT from '../../config/globals/endpoint.js';
const initialBackupRestore = {

	async init() {
		await this._giveEvenForm();
		this._syncData()
	},

	async _syncData() {
		const data = await ApiSettingApps.getSettingApps();
		document.getElementById('lastBackup').innerHTML = data.backup_database;
		document.getElementById('lastRestore').innerHTML = data.restore_database;
	},

	async _giveEvenForm() {
		const eventBackupMysql = async () => {
			try {
				window.location.href = API_ENDPOINT.BACKUP_DATABASE;
				await this._syncData();
			} catch (error) {
				console.log(error);
				this._notification('Maaf Ada masalah Didalam Server ...', 'error', true);
			}
		}

		const eventBackupSqlite = async () => {
			try {
				const response = await this.syncLastBackup();
				if (response) {
					this._notification('Database berhasil di backup', 'success', false);
				} else {
					this._notification('Maaf ada masalah didalam server ...', 'error', true);
				}
				await this._syncData();
			} catch (error) {
				console.log(error)
			}
		}

		const eventRestoreDb = async (e) => {
			e.preventDefault();
			var DBFile = $("#fileDb").val();
			try {
				if (DBFile == '') {
					this._notification('File database masih kosong', 'error', true);
				} else {
					var fileInput = document.getElementById('fileDb');
					var fileName = fileInput.files[0].name;
					var fileExtension = fileName.split('.').pop();
					if (fileExtension == 'db') {
						const response = await this.uploadSqliteDb(new FormData(document.getElementById('restore-db-sqlite')));
						if (response.status) {
							this._notification(response.message, 'success', false);
							await this._syncData();
							document.getElementById('restore-db-sqlite').reset();
						} else {
							this._notification(`${response.message}<br> ${response.problem.error}`, 'error', true);
						}
					} else {
						this._notification("File ini bukan database!", "error", true);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
		// document.getElementById('backupDatabase').addEventListener('click', eventBackupMysql);
		document.getElementById('backupDatabaseSqlite').addEventListener('click', eventBackupSqlite);
		document.getElementById('restore-db-sqlite').addEventListener('submit', eventRestoreDb);
	},

	_notification(msg, status, confirm) {
		swal.fire({
			title: `${status}`,
			html: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3',
			showConfirmButton: confirm,
			timer: 2000
		})
	},

	async syncLastBackup() {
		try {
			const response = await fetch(API_ENDPOINT.BACKUP_DATABASE_SQLITE);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	},

	async uploadSqliteDb(dataForm) {
		const myHeaders = new Headers();
		const response = await fetch(API_ENDPOINT.RESTORE_DATABASE_SQLITE, {
			method: 'POST',
			headers: myHeaders,
			body: dataForm
		});
		return response.json();
	}
}

export default initialBackupRestore;
