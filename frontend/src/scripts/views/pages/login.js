import LoginInitiator from "../../presenter/login-presenter.js";

const Login = {
    async render() {
        return `<div class="container">
        <!-- Outer Row -->
        <div class="row justify-content-center">
  
            <div class="col-xl-10 col-lg-12 col-md-9">
  
                <div class="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-6 d-none d-lg-block ">
                                <img class="img-fluid" src="./src/public/img/loginpage.png" alt="image login">
                            </div>
                            <div class="col-lg-6">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>
                                   
                                    <form class="user" class="form-horizontal" id='login-user'>
                                        <div class="form-group">
                                            <input type="text" name="username" class="form-control form-control-user" id="username" aria-describedby="username" placeholder="Username...">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user" id="password" name="password" placeholder="Password">
                                        </div>
  
                                        <button id="btnLogin" class="btn btn-primary btn-user btn-block">Login</button>
  
                                    </form>
                                    <hr>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  
            </div>
  
        </div>
  
    </div>`
   },
  
    async afterRender() {
        await LoginInitiator.init();
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default Login;
  

