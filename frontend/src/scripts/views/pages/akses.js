import initialAkses from '../../presenter/setting/initial_akses.js'

import initialSecurity from '../../presenter/setting/initial_security.js'
const AksesView = {
    async render() {
      return ` <div class="page-content-wrap">

      <div class="row">
      <div class="col-md-12">
        <div class="mb-3">
                <select class="form-select form-control" aria-label="Pilih Jenis User" id="list-type-user">
                    <option selected>Pilih Jenis User</option>
                   
                </select>
        </div>
      </div>
       
      <div class="col-md-12">
       
         <div class="card shadow mb-4">
            
            <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCardExample">
                <h6 class="m-0 font-weight-bold text-primary">Pengaturan Hak Akses User</h6>
            </a>

            <div class="collapse show" id="collapseCardExample">

                <div class="card-body" id="roleAkses">
               
               

                </div>

            </div>
          </div>


          <div class="card shadow mb-4">
            
            <a href="#collapseDashboard" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseDashboard">
                <h6 class="m-0 font-weight-bold text-primary">Pengaturan Tampilan Dashboard user</h6>
            </a>

            <div class="collapse show" id="collapseDashboard">

                <div class="card-body" id="roleDashboard">
               
               

                </div>

            </div>
          </div>
         
  
          </div>
    </div>
  
  </div>
  

 
  
          `;
    },
  
    async afterRender() {
        await initialAkses.init();
        await initialSecurity.init({statePage : 'hak_akses'})
    },

  
    _errorContent() {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default AksesView;
  