class AppBar extends HTMLElement {
    connectedCallback() {
        this._render();
    }

    set setName(data) {
        document.getElementById('level-user').value = data.level;
        document.getElementById('user-id').value = data.id;
        document.getElementById('is_username').value = data.username;
        document.getElementById('nama-user').innerHTML = data.name;
        this._nameUser = data.name;
        this._idUser = data.id;
        this._levelID = data.level;
        this._username = data.username;
    }

    _render() {
        this.innerHTML = `<nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>
                
                <ul class="navbar-nav ml-auto">
                
                    <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                    <li class="nav-item dropdown no-arrow d-sm-none">
                        <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-search fa-fw"></i>
                        </a>
                    </li>
                
                    <!-- Nav Item - Alerts -->
                    
                
                   
                
                    <div class="topbar-divider d-none d-sm-block"></div>
                
                    <!-- Nav Item - User Information -->
                    <li class="nav-item dropdown no-arrow">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="mr-2 d-none d-lg-inline text-gray-600 small" id='nama-user'>${this._nameUser}</span>
                            <input type="hidden" id="level-user" value='${this._levelID}' />
                            <input type="hidden" id="user-id" value='${this._idUser}' />
                            <input type="hidden" id="is_username" value='${this._username}' />
                         
                            <img class="img-profile rounded-circle"
                                src="./src/public/img/undraw_profile.svg">
                        </a>
                        <!-- Dropdown - User Information -->
                        <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="userDropdown">
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </a>
                        </div>
                    </li>
                
                </ul>
                
                </nav>`;
    }
}

customElements.define('app-bar', AppBar);
