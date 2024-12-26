<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('longdate_indo')) {
	function longdate_indo($date)
	{
		$BulanIndo = array("Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember");

		$tahun = substr($date, 0, 4);
		$bulan = substr($date, 5, 2);
		$tgl   = substr($date, 8, 2);

		$result = $tgl . " " . $BulanIndo[(int)$bulan - 1] . " " . $tahun;
		return ($result);
	}
}

if (!function_exists('mediumdate_indo')) {
	function mediumdate_indo($date)
	{
		$BulanIndo = array("Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des");

		$tahun = substr($date, 0, 4);
		$bulan = substr($date, 5, 2);
		$tgl   = substr($date, 8, 2);

		$result = $tgl . " " . $BulanIndo[(int)$bulan - 1] . " " . $tahun;
		return ($result);
	}
}

if (!function_exists('shortdate_indo')) {
	function shortdate_indo($date)
	{
		$BulanIndo = array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");

		$tahun = substr($date, 0, 4);
		$bulan = substr($date, 5, 2);
		$tgl   = substr($date, 8, 2);

		$result = $tgl . "-" . $BulanIndo[(int)$bulan - 1] . "-" . $tahun;
		return ($result);
	}
}

if (!function_exists('month_indo')) {
	function month_indo($date)
	{
		$BulanIndo = array("Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember");

		$tahun = substr($date, 0, 4);
		$bulan = substr($date, 5, 2);

		$result = $BulanIndo[(int)$bulan - 1] . " " . $tahun;
		return ($result);
	}
}

if (!function_exists('month_indo_medium')) {
	function month_indo_medium($date)
	{
		$BulanIndo = array("Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des");

		$tahun = substr($date, 0, 4);
		$bulan = substr($date, 5, 2);

		$result = $BulanIndo[(int)$bulan - 1] . " " . $tahun;
		return ($result);
	}
}

if (!function_exists('year_indo')) {
	function year_indo($date)
	{
		$tahun = substr($date, 0, 4);

		$result = $tahun;
		return ($result);
	}
}

if (!function_exists('time_indo')) {
	function time_indo($date)
	{
		return date('H:i', strtotime($date));
	}
}
