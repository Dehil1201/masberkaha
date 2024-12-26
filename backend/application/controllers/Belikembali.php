<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Belikembali extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("BeliKembali_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->buybackModel = $this->BeliKembali_model;
    }

    function getBeliKembali()
    {
        error_reporting(0);
        $grandTotal = $this->buybackModel->sumWhereBuyback('beli_kembali', 'grand_total', 'faktur IS NOT NULL', null);
        $list = $this->buybackModel->get_datatables();
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $row[] = $no++;
            $row[] = $field->faktur;
            $row[] = $field->nota;
            $row[] = shortdate_indo($field->date);
            $row[] = time_indo($field->created_at);
            $row[] = "-" . rupiah($field->grand_total);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "grand_total" => rupiah($grandTotal),
            "recordsTotal" => $this->buybackModel->count_all(),
            "recordsFiltered" => $this->buybackModel->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function filterBeliKembali()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $user = $this->input->post('user', TRUE, NULL);
        $pelanggan = $this->input->post('pelanggan', TRUE, NULL);
        $grandTotal = $this->buybackModel->sumWhereBuyback('beli_kembali', 'grand_total', 'faktur IS NOT NULL', null, $startDate, $endDate, 'date', $user, $pelanggan);
        $list = $this->buybackModel->get_datatables_filter($startDate, $endDate, $user, $pelanggan);
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $row[] = $no++;
            $row[] = $field->faktur;
            $row[] = $field->nota;
            $row[] = shortdate_indo($field->date);
            $row[] = time_indo($field->created_at);
            $row[] = "-" . rupiah($field->grand_total);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "grand_total" => rupiah($grandTotal),
            "recordsTotal" => $this->buybackModel->count_all(),
            "recordsFiltered" => $this->buybackModel->count_filtered_filter($startDate, $endDate, $user, $pelanggan),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getBeliKembaliDetail()
    {
        error_reporting(0);
        $list = $this->buybackModel->get_datatables_detail($this->userID);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = getBarangID($field->kode_barang, 'foto');
            $row[] = $field->berat;
            $row[] = getBarangID($field->kode_barang, 'kadar');
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->potgram) . '=' . rupiah($field->potongan);
            $row[] = rupiah($field->harga_kembali);
            $row[] = rupiah($field->biaya_servis);
            $row[] = rupiah($field->total);
            $row[] = $field->status;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->buybackModel->count_all_detail(),
            "recordsFiltered" => $this->buybackModel->count_filtered_detail($this->userID),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getFakturNotaBuyback()
    {
        error_reporting(0);
        $nota = $this->input->post('faktur', TRUE, NULL);
        $list = $this->buybackModel->getDetail($nota);
        $head = $this->buybackModel->getHead($nota);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id" => $field->id,
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "jenis_barang" => getBarangID($field->kode_barang, 'jenis_barang'),
                "nama_barang" => getBarangID($field->kode_barang, 'nama_barang'),
                "berat" => $field->berat,
                "harga_beli" => rupiah($field->harga_beli),
                "potongan" => rupiah($field->potgram) . '=' . rupiah($field->potongan),
                "harga_kembali" => rupiah($field->harga_kembali),
                "biaya_servis" => rupiah($field->biaya_servis),
                "total" => rupiah($field->total),
                "status" => $field->status
            );
        }
        foreach ($head as $headField) {
            $pelangganID = getDataField("beli_kembali", "faktur", "$headField->nota", "pelanggan_id");
            $dataHead = array(
                "faktur" => $headField->faktur,
                "nota" => $headField->nota,
                "nama_pelanggan" => getPelangganID(($pelangganID != NULL) ? $pelangganID : 0, "nama_pelanggan"),
                "alamat_pelanggan" => getPelangganID(($pelangganID != NULL) ? $pelangganID : 0, "alamat"),
                "date" => longdate_indo($headField->date),
                "dateShort" => shortdate_indo($field->date),
                "grand_total" => rupiah($headField->grand_total),
                "kasir" => getUserID($headField->user_id, "nama_user")
            );
        }
        $output = array(
            "headBuyback" => $dataHead,
            "detailBuyback" => $data,
        );
        echo json_encode($output);
    }

    public function storeDetail()
    {
        $checkCart = checkData('beli_kembali_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')), $this->userID);
        if ($checkCart < 1) {
            echo json_encode($this->buybackModel->addTransactionsDetail($this->userID));
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah ada di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function testCase()
    {
        echo $this->buybackModel->testCase();
    }

    public function updateDetail()
    {
        echo json_encode($this->buybackModel->updateDetail());
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function destroyDetail()
    {
        $checkStatus = checkStatusDetail('beli_kembali_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        if ($checkStatus > 0) {
            echo json_encode($this->buybackModel->delTransactionsDetail($this->userID));
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah di proses!'
            );
            echo json_encode($output);
        }
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->buybackModel->rules());
        $nota = $this->input->post('nota', TRUE, NULL);

        $checkStatusJual = checkStatusJual('penjualan_detail', 'faktur', $nota);
        $checkChart = countWhere('penjualan_detail', 'faktur', $nota);
        $checkBuybackDet = checkData('beli_kembali_detail', 'faktur', '-', $this->userID);
        if ($checkBuybackDet > 0) {
            if ($validation->run()) {
                if ($checkStatusJual === $checkChart) {
                    echo json_encode($this->buybackModel->addTransactionsTunai($this->userID, 1));
                } else {
                    echo json_encode($this->buybackModel->addTransactionsTunai($this->userID, 0));
                }
                $this->LogActivity_model->saveLog($this->userID);
            }
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'Tidak ada barang di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function checkBarangJual()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $checkData = checkBarangJual('data_barang', 'kode_barang', $kodeBarang);
        if ($checkData > 0) {
            $output = array(
                "status" => TRUE,
                "message" => 'kode barang: ' . $kodeBarang . ' tersedia!',
                "data" => array(
                    "id_barang" => getBarangID($kodeBarang, 'id'),
                    "kode_barang" => $kodeBarang,
                    "nama_barang" => getBarangID($kodeBarang, 'nama_barang'),
                    "jenis_barang" => getBarangID($kodeBarang, 'jenis_barang'),
                    "berat" => getBarangID($kodeBarang, 'berat'),
                    "kadar" => getBarangID($kodeBarang, 'kadar'),
                    "foto" => getBarangID($kodeBarang, 'foto'),
                    "total" => getBarangID($kodeBarang, 'harga_jual'),
                    "harga_jual" => getBarangID($kodeBarang, 'harga_jual'),
                    "potongan" => getPengaturan('harga_potongan'),
                )
            );
            echo json_encode($output);
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $kodeBarang . ' tidak ada!',
                "data" => null
            );
            echo json_encode($output);
        }
    }

    public function infoTransaksiBuyback()
    {
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $user = $this->input->post('user');
        $pelanggan = $this->input->post('pelanggan');
        $totalPotongan = $this->buybackModel->sumWhereBuyback('beli_kembali_detail', 'potongan', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan);
        $totalServis = $this->buybackModel->sumWhereBuyback('beli_kembali_detail', 'biaya_servis', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan);
        $hargaKembali = $this->buybackModel->sumWhereBuyback('beli_kembali_detail', 'harga_kembali', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan);
        $subtotal = $hargaKembali + $totalPotongan;
        $total = $this->buybackModel->sumWhereBuyback('beli_kembali_detail', 'total', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan);
        $output = array(
            "totalBerat" => round($this->buybackModel->sumWhereBuyback('beli_kembali_detail', 'berat', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan), 2),
            "subtotalBuyback" => rupiah($subtotal),
            "totalPotongan" => rupiah($totalPotongan),
            "totalServis" => rupiah($totalServis),
            "totalBuyback" => rupiah($total),
            "jumlahNota" => $this->buybackModel->countNota('beli_kembali', $startDate, $endDate, $user, $pelanggan),
        );
        echo json_encode($output);
    }

    public function destroyTransactions()
    {
        $userId = $this->userID;
        $faktur = $this->input->post('faktur', TRUE, NULL);
        echo json_encode($this->buybackModel->delTransactions($faktur));
        $this->LogActivity_model->saveLog($userId);
    }

    public function destroyDetailTransactions()
    {
        $userId = $this->userID;
        $kode_barang = $this->input->post('kode_barang', TRUE, NULL);
        $faktur = $this->input->post('faktur', TRUE, NULL);
        echo json_encode($this->buybackModel->delDetailTransactions($kode_barang, $faktur));
        $this->LogActivity_model->saveLog($userId);
    }
}
