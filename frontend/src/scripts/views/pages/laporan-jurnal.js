import LaporanJurnalInitiator from "../../presenter/laporan/initial_laporanjurnal.js";
import initialSecurity from '../../presenter/setting/initial_security.js'
const DataLaporanJurnal = {
	async render() {
		return /*html*/ `<h1 class="h3 mb-2 text-gray-800">Cetak Laporan Jurnal</h1>
        <div class="card shadow mb-4">
        <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCardExample">
                <h6 class="m-0 font-weight-bold text-primary">Pilihan Tanggal Laporan</h6>
            </a>

            <div class="collapse show" id="collapseCardExample">
                <div class="card-body">
                    <form id="cetakLaporanJurnal">
                        <div class="form-group row">
                            <label for="startDate" class="col-sm-1 col-form-label">Tanggal</label>
                            <div class="col-sm-3">
                                <input type="date" class="form-control" id="startDate">
                            </div>
                            <label for="endDate" class="col-form-label font-weight-bold">s/d</label>
                            <div class="col-sm-3">
                                <input type="date" class="form-control" id="endDate">
                            </div>
                                <button class="btn btn-success" type="submit" title="Tampilkan Data"><i class="fas fa-print" id="filterData"></i> Tampilkan [F9]</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="card shadow mb-4">
        <a href="#collapseJurnal" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseJurnal">
                <h6 class="m-0 font-weight-bold text-primary">Laporan Jurnal Umum</h6>
            </a>

            <div class="collapse show" id="collapseJurnal">
                <div class="card-body">
                <textarea id="laporanView"></textarea>
                </div>
            </div>
        </div>`;
	},


	async afterRender() {
        await LaporanJurnalInitiator.init();
        await initialSecurity.init({statePage : 'laporan_jurnal'});
	},

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default DataLaporanJurnal;
