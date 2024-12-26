import CONFIG from '../../config/globals/config.js';
import initialBackupRestore from '../../presenter/setting/initial_backup-restore.js';
import initialSecurity from '../../presenter/setting/initial_security.js';

const BackupRestore = {
	async render() {
		return `<div class="page-content-wrap">

        <div class="row">
    
            <div class="col-md-12">
    
                <div class="card shadow mb-4">
                    <a href="#backupCollapseCard" class="d-block card-header py-3" data-toggle="collapse" role="button"
                        aria-expanded="true" aria-controls="backupCollapseCard">
                        <h6 class="m-0 font-weight-bold text-primary">Backup Database / Cadangkan Data</h6>
                    </a>
    
                    <div class="collapse show" id="backupCollapseCard">
                        <div class="card-body">
                            <!-- <button id="backupDatabase" class="btn btn-primary" title="Backup Database">Backup Database MySQL</button> --!>
                            <a href="${CONFIG.BASE_URL}db/db_sidamas.db" download="BAK_db_sidamas-${new Date().toJSON().slice(0,10).replace(/-/g,'-')}.db" id="backupDatabaseSqlite" class="btn btn-secondary" title="Backup Database">Backup Database SQLite3</a>
                            <h6 class="mt-3"><i class="fas fa-clock"></i> Backup Database SQLite3 Terakhir: <b><span
                                        id="lastBackup">null</span></b></h6>
                        </div>
                    </div>
                </div>

                <div class="card shadow mb-4">
                    <a href="#restoreCollapseCard" class="d-block card-header py-3" data-toggle="collapse" role="button"
                        aria-expanded="true" aria-controls="restoreCollapseCard">
                        <h6 class="m-0 font-weight-bold text-primary">Restore Database / Pulihkan Data</h6>
                    </a>
    
                    <div class="collapse show" id="restoreCollapseCard">
                        <div class="card-body">
                        <form id='restore-db-sqlite' enctype="multipart/form-data">
                            <div class="form-group">
                                <div class="col-sm-6">
                                    <label for="fileDb">Restore Database</label>
                                    <input type="file" class="form-control-file" name="fileDb" id="fileDb" accept=".db">
                                    <button type="submit" id="uploadDatabase" class="btn btn-primary mt-2" title="Upload Database">Upload Database</button>
                                </div>
                            </div>
                        </form>
                        <h6 class="mt-3"><i class="fas fa-clock"></i> Restore Database SQLite3 Terakhir: <b><span
                                        id="lastRestore">null</span></b></h6>
                        </div>
                    </div>
                </div>
                <div class="card shadow mb-4">
                </div>
            </div>
        </div>
    </div>`;
	},

	async afterRender() {
		await initialBackupRestore.init();
        await initialSecurity.init({statePage : 'backup'});
    },

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default BackupRestore;
