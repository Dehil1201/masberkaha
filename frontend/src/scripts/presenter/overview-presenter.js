import SecurityRule from "./setting/initial_security.js";
import ApiDashboard from './../api/data-dashboard.js';
import FormatCurrency from '../utils/initial-currency.js';
import chartBar from '../utils/initial-chart.js';

const OverviewInitiator = {

	async init() {
		await this._setCountPelanggan();
		await this._setCountPenjualanMonthly();
		await this._setCountUser();
		await this._setCountBarang();
		await this._setCountSupplier();
		await this._setCountInstok();
		await this._setCountSold();
		await this._setAmountWeightSold();
		await this._setGraphPenjualan();
		this._setGraphChange();
	},

	async _setCountPelanggan() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_pelanggan_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getAmountPelanggan();
			document.getElementById('jumlah-pelanggan').innerHTML = data;
		}
	},

	async _setCountPenjualanMonthly() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_pendapatan_penjualan_bulanan_dashboard');
		if (isAllowin) {
			const data = await FormatCurrency.setValue(await ApiDashboard.getAmountPenjualanBulanan());
			document.getElementById('jumlah-pendapatan-bulanan').innerHTML = data;
		}
	},


	async _setCountBarang() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_barang_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getAmountBarang();
			document.getElementById('jumlah-barang').innerHTML = `${data} Buah`;
		}
	},
	async _setCountUser() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_user_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getAmountUser();
			document.getElementById('jumlah-user').innerHTML = data;
		}
	},

	async _setCountSupplier() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_supplier_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getAmountSupplier();
			document.getElementById('jumlah-supplier').innerHTML = data;
		}
	},

	async _setCountInstok() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_barang_instok_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getCountInstok();
			document.getElementById('jumlah-barang-instok').innerHTML = `${data} Buah`;
		}
	},

	async _setCountSold() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_barang_terjual_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getCountSold();
			document.getElementById('jumlah-barang-sold').innerHTML = `${data} Buah`;
		}
	},

	async _setAmountWeightSold() {
		const isAllowin = await SecurityRule.initRuleDashboard('jumlah_berat_terjual_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getAmountWeightSold();
			document.getElementById('jumlah-berat-sold').innerHTML = `${data} Gram`;
		}
	},

	async _setGraphPenjualan(state) {
		const isAllowin = await SecurityRule.initRuleDashboard('grafik_penjualan_bulanan_dashboard');
		if (isAllowin) {
			const data = await ApiDashboard.getGraphPenjualan(state);
			let arrLabel = [];
			let arrValue = [];
			await data.forEach(async (data) => {
				arrLabel.push(data.date);
				arrValue.push(data.grand_total);
			});
			await chartBar.initBarChart(arrLabel, arrValue);
		}
	},

	async _setGraphChange() {
		let labelGraph = document.getElementById('state-graph');
		const grafik = async () => {
			let state = document.getElementById("siklus-grafik");
			labelGraph.innerHTML = state.options[state.selectedIndex].text;
			await this._setGraphPenjualan(state.value)
		}
		document.getElementById("siklus-grafik").addEventListener('change', grafik);
	},
}

export default OverviewInitiator;
