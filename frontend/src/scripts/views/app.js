import routes from '../routes/routes.js';
import UrlParser from '../routes/url-parser.js';
import Autentication from '../utils/autentication.js';
import ChangeColor from '../utils/initial_change_color.js';
import SideBar from './component/side-bar.js';
import Footer from './component/footer-bar.js';

import SideBarHelper from '../utils/side-bar-helper.js';
import ShorcutInitialize from '../utils/key-shorcut.js';

class App {
  constructor({content}) {
   
    this._content = content;
    this._initialAppShell();
  }
    _initialAppShell() {
      SideBar.init();
      Footer.init();
      this._initLogout();
      ShorcutInitialize.initialShortcut();
    }

    _initLogout(){
      document.getElementById('logout-apps').addEventListener('click', async ()=>{
       Autentication._logOut();
       $('#logoutModal').modal('hide');
       await this.renderPage();
       
      })
    }
  
    async renderPage() {
      this._giveTheLoading();
      const isLogin = await Autentication.isLogin();
      let url = UrlParser.parseActiveUrlWithCombiner();

      if (!(url in routes)) {
        window.location.hash = '#/404';
        url = UrlParser.parseActiveUrlWithCombiner();
      }

      if (!isLogin) {
        window.location.hash = '#/login';
        url = UrlParser.parseActiveUrlWithCombiner();
      }else{
        this._setView(url);
      }

        const page = routes[url];
        this._content.innerHTML = await page.render();
        await page.afterRender();
       await this.afterRenderPage(url);
    }

     async afterRenderPage(url){
  
      ChangeColor.removeColor("bg-gradient-info");
      ChangeColor.removeColor("bg-gradient-dark");
      ChangeColor.removeColor("bg-gradient-success");
      ChangeColor.removeColor("bg-gradient-primary");
      ChangeColor.removeColor("bg-gradient-warning");
      ChangeColor.removeColor("bg-gradient-danger");
      ChangeColor.removeColor("bg-gradient-secondary");

      if (url == '/penjualan') { 
        ChangeColor.initColor("bg-gradient-info");
      } else if (url == '/pembelian') {
        ChangeColor.initColor("bg-gradient-dark")
      } else if(url == '/belikembali') {
        ChangeColor.initColor("bg-gradient-success")
      }else if(url == '/buyback-oldstok') {
        ChangeColor.initColor("bg-gradient-warning")
      }else if(url == '/transaksi-quantity') {
        ChangeColor.initColor("bg-gradient-danger")
      }else if(url == '/hutang') {
        ChangeColor.initColor("bg-gradient-secondary")
      }else{
        ChangeColor.initColor("bg-gradient-primary")
      }

      SideBarHelper.removeActivator();
      SideBarHelper.activeByPage(url)
    }

    _giveTheLoading(){
      this._content.innerHTML = `<div class="text-center">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>s`;
    }

   async _setView(){
      const datas = await Autentication.getData();
      datas.forEach( data => {
        document.querySelector('app-bar').setName = data;
      });
    }
  }
  
  export default App;
  