
const notAcces = {
    async render() {
      return `  
      <div class="text-center">
        <div class="error mx-auto" data-text="500">500</div>
        <p class="lead text-gray-800 mb-5"> Maaf Anda Tidak Mempunyai Akses Ke halaman ini<br>&#128517;</p>
        <p class="text-gray-500 mb-0">  </p>
        <a href="#/">&larr; Back to Dashboard</a>
      </div>
          `;
    },
  
    async afterRender() {
    },

    _errorContent() {
  
    },

  };
  
  export default notAcces;
  

