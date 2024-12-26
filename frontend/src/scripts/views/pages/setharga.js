import initialSettingHarga from '../../presenter/setting/initial_setting-harga.js';

import initialSecurity from '../../presenter/setting/initial_security.js';

const SettingHarga = {
    async render() {
      return `<div class="page-content-wrap">

      <div class="row">
       
      <div class="col-md-12">
       
         <div class="card shadow mb-4">
            
            <a href="#collapseCard" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCard">
                <h6 class="m-0 font-weight-bold text-primary">Pengaturan Naik dan Turunkan Harga</h6>
            </a>

            <div class="collapse show" id="collapseCard">

                <div class="card-body" >
                <form id='aturan'>

                <div class="form-group row">
                <label for="" class="col-sm-3 col-form-label">Pilih Aksi</label>
                <div class="col-sm-9">
                <select class='form-control' id='status-aksi' name='status'> 
                    <option value='1'>Naikan Semua Harga</option>
                    <option value='2'>Turunkan Semua Harga</option>
                </select>
                
                </div>
              </div>

                <div class="form-group row">
                  <label for="" class="col-sm-3 col-form-label">Jumlah</label>
                  <div class="col-sm-9">
                    <input type="text" name='jumlah_harga' data-decimal="," class="form-control" id="jumlah_harga" >
                  </div>
                </div>
             
                <div class="form-group row">
                  <div class="col-sm-10">
                    <button type="submit" title="Proses Perubahan Harga" class="btn btn-primary">Update</button>
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
    await initialSettingHarga.init();
    await initialSecurity.init({
			statePage: 'setting_harga'
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
  
  export default SettingHarga;
  

