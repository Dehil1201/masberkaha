<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Baranghistory extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("BarangHistory_model");
        $this->load->model("DataHelper_model");
        $this->load->library('datatables');
        $this->load->helper("rupiah_helper");
        $this->load->helper("data_helper");
        $this->load->helper("tgl_indo_helper");
    }

    function getBarangHistory()
    {
        error_reporting(0);
        $kodeBarang = htmlspecialchars($this->input->post("kode_barang"), ENT_QUOTES);
        $list = $this->BarangHistory_model->get_datatables($kodeBarang, null);
        $data = array();
        foreach ($list as $field) {
            $ongkos = $this->BarangHistory_model->getPenjualanDetail($field->faktur, $kodeBarang)->ongkos;
            $potongan = $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->potongan;
            $servis = $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->biaya_servis;
            $total = ($field->action == 'Penjualan') ? ($this->BarangHistory_model->getPenjualanDetail($field->faktur, $kodeBarang)->total - $ongkos) : '-' . ($this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->harga_kembali - $potongan);
            $row = array();
            $row[] = $field->id;
            $row[] = longdate_indo($field->date) . " - " . time_indo($field->created_at);
            $row[] = $field->faktur;
            $row[] = $field->action;
            $row[] = rupiah($total);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->potgram) . '=' . rupiah($potongan);
            $row[] = rupiah($servis);
            $row[] = rupiah($total + $ongkos - ($potongan + $servis));

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->BarangHistory_model->count_all(),
            "recordsFiltered" => $this->BarangHistory_model->count_filtered($kodeBarang, null),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getHistoryPerbarang()
    {
        error_reporting(0);
        $action = $this->input->post('action', TRUE, NULL);
        $kodeBarang = htmlspecialchars($this->input->post("kode_barang"), ENT_QUOTES);
        $list = $this->BarangHistory_model->get_datatables($kodeBarang, $action);
        $data = array();
        foreach ($list as $field) {
            $ongkos = $this->BarangHistory_model->getPenjualanDetail($field->faktur, $kodeBarang)->ongkos;
            $potongan = $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->potongan;
            $servis = $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->biaya_servis;
            if ($field->action == 'Penjualan') {
                $total = $this->BarangHistory_model->getPenjualanDetail($field->faktur, $kodeBarang)->total - $ongkos;
            } else if ($field->action == 'Pembelian') {
                $total = $this->BarangHistory_model->getPembelianDetail($field->faktur, $kodeBarang)->total;
            } else {
                $total = $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->harga_kembali + $potongan;
            }
            // $total = ($field->action == 'Penjualan') ? $this->BarangHistory_model->getPenjualanDetail($field->faktur, $kodeBarang)->total - $ongkos : $this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->harga_kembali + $potongan;
            $row = array();
            $row[] = $field->id;
            $row[] = longdate_indo($field->date) . " - " . time_indo($field->created_at);
            $row[] = $field->faktur;
            $row[] = $field->action;
            $row[] = ($field->action == 'Beli Kembali') ? '-' . rupiah($total) : rupiah($total);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($this->BarangHistory_model->getBuybackDetail($field->faktur, $kodeBarang)->potgram) . '=' . rupiah($potongan);
            $row[] = rupiah($servis);
            $row[] = ($field->action == 'Beli Kembali') ? '-' . rupiah($total + $ongkos - ($potongan + $servis)) : rupiah($total + $ongkos - ($potongan + $servis));

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->BarangHistory_model->count_all(),
            "recordsFiltered" => $this->BarangHistory_model->count_filtered($kodeBarang, $action),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function getInfoHistory($kodeBarang = NULL)
    {
        $infoHistory = array(
            "countTerjual" => $this->DataHelper_model->countWhereDouble('barang_history', 'kode_barang', $kodeBarang, 'action', 'Penjualan'),
            "countTerima" => $this->DataHelper_model->countWhereDouble('barang_history', 'kode_barang', $kodeBarang, 'action', 'Beli Kembali'),
            "berat" => $this->DataHelper_model->getData("data_barang", "kode_barang", $kodeBarang)->berat,
            "harga" => rupiah($this->DataHelper_model->getData("data_barang", "kode_barang", $kodeBarang)->harga_jual),
        );
        echo json_encode($infoHistory);
    }

    public function store()
    {
        $userID = $this->session->userdata('userID');
        $barangHistory = $this->BarangHistory_model;
        echo json_encode($barangHistory->add('Action', $userID));
    }
}
