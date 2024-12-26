let chart = null;
class MyChart {
	static async initBarChart(label, value) {
		if (chart != null) {
			chart.destroy();
		}
		var ctx = document.getElementById('chartPenjualan');

		const number_format = (variable) => {
			let reverse = variable.toString().split('').reverse().join(''),
				format = reverse.match(/\d{1,3}/g);
			format = format.join('.').split('').reverse().join('');
			return format
		}

		if (value.length != 0) {
			var maxValue = value.reduce(function (a, b) {
				return Math.max(a, b);
			});
		} else {
			maxValue = 0;
		}

		const config = {
			type: 'bar',
			data: {
				labels: label,
				datasets: [{
					label: "Pemasukan",
					backgroundColor: "#4e73df",
					hoverBackgroundColor: "#2e59d9",
					borderColor: "#4e73df",
					data: value,
					maxBarThickness: 30,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: {
						left: 10,
						right: 25,
						top: 25,
						bottom: 33
					}
				},
				scales: {
					xAxes: [{
						time: {
							unit: 'day'
						},
						gridLines: {
							display: false,
							drawBorder: false
						},
						ticks: {
							maxTicksLimit: maxValue
						}
					}],
					yAxes: [{
						ticks: {
							beginAtZero: true,
							min: 0,
							max: maxValue,
							maxTicksLimit: 6,
							padding: 10,
							// Include a dollar sign in the ticks
							callback: function (value, index, values) {
								return 'Rp' + number_format(value);
							}
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2]
						}
					}],
				},
				legend: {
					display: false
				},
				tooltips: {
					titleMarginBottom: 10,
					titleFontColor: '#6e707e',
					titleFontSize: 14,
					backgroundColor: "rgb(255,255,255)",
					bodyFontColor: "#858796",
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
					callbacks: {
						label: function (tooltipItem, chart) {
							var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
							return datasetLabel + ': Rp' + number_format(tooltipItem.yLabel);
						}
					}
				},
			}
		};

		chart = new Chart(ctx, config);
	}
}

export default MyChart;
