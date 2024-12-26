import ApiDashboard from '../../api/data-dashboard.js';
const Footer = {
	async init() {
		setInterval(() => {
			this._timeNow();
		}, 1000);
		const result = this._render();
		document.getElementById('footer-elm').insertAdjacentHTML("afterbegin", result);
		this._getIpServer();
	},

	async _getIpServer() {
		const response = await ApiDashboard.getApiServer();
		document.getElementById('ipServer').innerHTML = response.data;
	},

	_render() {
		return `<div class="container-fluid my-auto">
	  <div class="copyright text-center my-auto">
		  <div class="row">
			  <div class="col-md-5 my-auto">
				  <h6>Copyright &copy; <a href="https://cektrend.com" target="_blank"
						  alt="Cektrend Studio ~ Solusi Bisnis Digital Terpercaya"
						  title="Cektrend Studio ~ Solusi Bisnis Digital Terpercaya"><b>Cektrend
							  Studio</b></a> 2022 | Version : <span id="version">1.1</span></h6>
			  </div>
			  <div class="col-md-7 my-auto">
				  <h6><i class="far fa-calendar"></i> <span id="dayNow">${_dayNow()}</span> <i class="far fa-clock"></i> <span id="timeNow"></span><span>&nbsp; <i class="fa fa-desktop"></i>&nbsp; Alamat Server : <b> <span id="ipServer"></span> </b></span>
				  </h6>
			  </div>
		  </div>
	  </div>
  </div>`;
	},

	async _timeNow() {
		let today = new Date();
		let h = today.getHours();
		let m = today.getMinutes();
		let s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		document.getElementById("timeNow").innerHTML = h + ":" + m + ":" + s;
	},
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}; // add zero in front of numbers < 10
	return i;
}

function _dayNow() {
	let date, hari, tanggal, bulan, tahun;
	let arrbulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	let myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
	date = new Date();
	hari = date.getDay();
	tanggal = date.getDate();
	bulan = date.getMonth();
	tahun = date.getFullYear();
	return myDays[hari] + ", " + tanggal + " " + arrbulan[bulan] + " " + tahun;
}


export default Footer;
