const SideBarHelper = {

	removeActivator() {
		const item = document.querySelectorAll('.sidebar-custom');
		for (let i = 0; i < item.length; i++) {
			let itemActive = document.querySelectorAll('.sidebar-custom');
			for (let j = 0; j < itemActive.length; j++) {
				itemActive[j].classList.remove('active');
			}
		}

	},

	activeByPage(routes) {
		if (routes == '/') return
		$(`[href*="#${routes}"]`).addClass('active');

		if ($(`[href*="#${routes}"]`).hasClass('item-master')) {
			$('#collapseMaster').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-pembelian')) {
			$('#collapsePembelian').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-penjualan')) {
			$('#collapsePenjualan').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-buyback')) {
			$('#collapseBuyback').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-akuntansi')) {
			$('#collapseAkuntansi').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-kelolaData')) {
			$('#kelolaDataCollapse').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-report')) {
			$('#collapseReport').collapse()
		} else if ($(`[href*="#${routes}"]`).hasClass('item-setting')) {
			$('#settingUtilitiesCollapse').collapse()
		}
	}
}

export default SideBarHelper;
