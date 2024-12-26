<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Overview extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("DataHelper_model");
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
    }

    public function index()
    {
        $data["title"] = "SIDAMAS";
        $this->load->view('overview', $data);
    }

    public function ipServer()
    {
        $data = $this->DataHelper_model->IPServer();
        echo json_encode([
            "data" => $data
        ]);
    }

    public function countBarang()
    {
        echo $this->DataHelper_model->countData('data_barang');
    }

    public function countPelanggan()
    {
        echo $this->DataHelper_model->countData('pelanggan');
    }

    public function countSupplier()
    {
        echo $this->DataHelper_model->countData('supplier');
    }

    public function countUser()
    {
        echo $this->DataHelper_model->countData('user');
    }

    public function countInstok()
    {
        echo $this->DataHelper_model->countInstok('data_barang');
    }

    public function countTerjual()
    {
        echo $this->DataHelper_model->countWhere('data_barang', 'status', 'J');
    }

    public function sumBeratTerjual()
    {
        echo round($this->DataHelper_model->sumWhere('data_barang', 'berat', 'status', 'J'), 2);
    }

    public function getMonthly()
    {
        $date = $this->input->post('date', TRUE, date('Y-m-d'));
        $monthlySum = $this->DataHelper_model->monthlySum('penjualan', 'grand_total', $date);
        if ($monthlySum == 0) {
            echo 0;
        } else {
            echo $this->DataHelper_model->monthlySum('penjualan', 'grand_total', $date);
        }
    }

    public function grafikData()
    {
        $status = $this->input->post('status', TRUE, 1);
        $list = $this->DataHelper_model->grafikDataDaily('penjualan', 'grand_total', 'date');
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row['date'] = shortdate_indo($field->date);
            $row['grand_total'] = rupiah($field->grand_total);
            $data[] = $row;
        }
        echo json_encode($data);
    }

    public function grafikPenjualanDaily()
    {
        $list = $this->DataHelper_model->grafikDataDaily('penjualan', 'grand_total', 'date');
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row['date'] = shortdate_indo($field->date);
            $row['grand_total'] = $field->grand_total;
            $data[] = $row;
        }
        echo json_encode($data);
    }

    public function grafikPenjualanMonthly()
    {
        $list = $this->DataHelper_model->grafikDataMonthly('penjualan', 'grand_total', 'date');
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row['date'] = month_indo_medium($field->date);
            $row['grand_total'] = $field->grand_total;
            $data[] = $row;
        }
        echo json_encode($data);
    }

    public function grafikPenjualanYearly()
    {
        $list = $this->DataHelper_model->grafikDataYearly('penjualan', 'grand_total', 'date');
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row['date'] = year_indo($field->date);
            $row['grand_total'] = rupiah($field->grand_total);
            $data[] = $row;
        }
        echo json_encode($data);
    }

    public function getIncomeSource()
    {
        $sumPenjualanIncome = $this->DataHelper_model->sumIncome('faktur', 'pemasukan', 'PJ');
        $sumServisIncome = $this->DataHelper_model->sumIncome('faktur', 'pemasukan', 'JS');
        $jumlahIncome = $sumPenjualanIncome + $sumServisIncome;
        $data = array(
            "incomePenjualan" => $sumPenjualanIncome,
            "incomeServis" => $sumServisIncome,
            "total" => $jumlahIncome,
            // "incomePenjualanPercent" => round($sumPenjualanIncome / $jumlahIncome * 100, 2),
            // "incomeServisPercent" => round($sumServisIncome / $jumlahIncome * 100, 2)
        );
        echo json_encode($data);
    }

    public function scynchSaldo()
    {
        $helperSynchSaldo = $this->DataHelper_model->scynchSaldo();
        echo json_encode($helperSynchSaldo);
    }
}
