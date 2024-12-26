import initialSettingApps from '../../presenter/setting/initial_setting-apps.js';
import initialSecurity from '../../presenter/setting/initial_security.js';

const SettingApps = {
	async render() {
		return `<div class="page-content-wrap">
    <div class="row">
     
    <div class="col-md-12">
       <div class="card shadow mb-4">
          
          <a href="#collapseCard" class="d-block card-header py-3" data-toggle="collapse"
              role="button" aria-expanded="true" aria-controls="collapseCard">
              <h6 class="m-0 font-weight-bold text-primary">Harga Potongan</h6>
          </a>

          <div class="collapse show" id="collapseCard">

              <div class="card-body" >
              <form id='aturan'>
              <div class="form-group row">
                <label for="id" class="col-sm-3 col-form-label">ID Aturan</label>
                <div class="col-sm-9">
                  <input type="id" name='id' class="form-control" id="id" readonly>
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-sm-3 col-form-label">Harga Potongan</label>
                <div class="col-sm-9">
                  <input type="text" name='harga_potongan' data-decimal="," class="form-control" id="harga_potongan">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-10">
                  <button type="submit" title="Update Pengaturan Harga" class="btn btn-primary">Update</button>
                </div>
              </div>
            </form>

              </div>
          </div>
       </div>
       <div class="card shadow mb-4">
            
        <a href="#collapseCardHargaPasar" class="d-block card-header py-3" data-toggle="collapse"
            role="button" aria-expanded="true" aria-controls="collapseCardHargaPasar">
            <h6 class="m-0 font-weight-bold text-primary">Harga Pasaran</h6>
        </a>

        <div class="collapse show" id="collapseCardHargaPasar">

            <div class="card-body" >
            <form id='acuanPasar'>
            <div class="form-group row">
              <label for="" class="col-sm-3 col-form-label">Harga Pasaran</label>
              <div class="col-sm-9">
                <input type="text" name='harga_pasar' data-decimal="," class="form-control" id="harga_pasar" >
              </div>
            </div>
         
            <div class="form-group row">
              <div class="col-sm-10">
                <button type="submit" title="Proses Harga Acuan Pasar" class="btn btn-primary">Update</button>
              </div>
            </div>
          </form>

            </div>
        </div>
     </div>
     </div>
  </div>
</div>`;
	},

	async afterRender() {
		await initialSettingApps.init(); 
    await initialSecurity.init({
			statePage: 'pengaturan'
		});
	},

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default SettingApps;
