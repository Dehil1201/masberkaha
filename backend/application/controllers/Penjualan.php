<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Penjualan extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("Penjualan_model");
        $this->load->model("Laporan_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->penjualanModel = $this->Penjualan_model;
        $this->laporanModel = $this->Laporan_model;
    }

    function getPenjualan()
    {
        error_reporting(0);
        $beratTotal = round($this->penjualanModel->sumWherePenjualan('penjualan', 'total_berat', 'faktur IS NOT NULL'), 2);
        $ongkosTotal = $this->penjualanModel->sumWherePenjualan('penjualan_detail', 'ongkos', 'status_proses', 1);
        $grandTotal = $this->penjualanModel->sumWherePenjualan('penjualan', 'grand_total', 'faktur IS NOT NULL');
        $subTotal = ($grandTotal - $ongkosTotal);
        $list = $this->penjualanModel->get_datatables();
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $ongkos = sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $subtotal = $field->grand_total - sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $row[] = $no++;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = time_indo($field->created_at);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($subtotal);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($field->grand_total);

            $data[] = $row;
        }

        $output = array(
            "berat" => $beratTotal,
            "subtotal" => rupiah($subTotal),
            "ongkos" => rupiah($ongkosTotal),
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function filterPenjualan()
    {
        error_reporting(0);
        $status = $this->input->post('status_bayar', TRUE, NULL);
        $user = $this->input->post('user', TRUE, NULL);
        $pelanggan = $this->input->post('pelanggan', TRUE, NULL);
        if ($status == 1) {
            $col = 'status_bayar';
            $val = 1;
        } elseif ($status == 2) {
            $col = 'status_bayar';
            $val = 2;
        } else {
            $col = 'faktur IS NOT NULL';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $list = $this->penjualanModel->get_datatables_filter($col, $val, $startDate, $endDate, $user, $pelanggan);
        $beratTotal = $this->laporanModel->queryManualPerbarang('Penjualan', 'SUM(DISTINCT berat)', $startDate, $endDate, $user, $pelanggan);
        $ongkosTotal = $this->penjualanModel->sumWherePenjualanFilter('ongkos', $startDate, $endDate, $user, $pelanggan);
        $grandTotal = $this->penjualanModel->sumWherePenjualanFilter('total', $startDate, $endDate, $user, $pelanggan);
        $subTotal = ($grandTotal - $ongkosTotal);
        $data = array();
        $no = 1;
        foreach ($beratTotal as $row) {
            $dataBeraTot[] = $row->result;
        }
        foreach ($list as $field) {
            $row = array();
            $ongkos = sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $subtotal = $field->grand_total - sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $row[] = $no++;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = time_indo($field->created_at);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($subtotal);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($field->grand_total);

            $data[] = $row;
        }

        $output = array(
            "berat" => ($dataBeraTot == null) ? 0 : round(array_sum($dataBeraTot), 2),
            "subtotal" => rupiah($subTotal),
            "ongkos" => rupiah($ongkosTotal),
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered_filter($col, $val, $startDate, $endDate, $user, $pelanggan),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getLabaRugi()
    {
        error_reporting(0);
        $beratTotal = round($this->penjualanModel->sumWherePenjualan('penjualan', 'total_berat', 'faktur IS NOT NULL'), 2);
        $pokokModal = $this->penjualanModel->sumWherePenjualan('penjualan', 'pokok_modal', 'faktur IS NOT NULL');
        $ongkosTotal = $this->penjualanModel->sumWherePenjualan('penjualan_detail', 'ongkos', 'status_proses', 1);
        $grandTotal = $this->penjualanModel->sumWherePenjualan('penjualan', 'grand_total', 'faktur IS NOT NULL');
        $subTotal = ($grandTotal - $ongkosTotal);
        $list = $this->penjualanModel->get_datatables();
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $ongkos = sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $subtotal = $field->grand_total - sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $labaRugi = $subtotal - $field->pokok_modal;
            $row[] = $no++;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = time_indo($field->created_at);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($subtotal);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($field->grand_total);
            $row[] = rupiah($field->pokok_modal);
            $row[] = rupiah($labaRugi);
            $row[] = rupiah($labaRugi + $ongkos);

            $data[] = $row;
        }

        $output = array(
            "pokok_modal" => ($pokokModal != null) ? $pokokModal : 0,
            "labarugi" => ($subTotal != null) ? rupiah($subTotal - $pokokModal) : 0,
            "labarugi_ongkos" => ($ongkosTotal != null) ? rupiah(($subTotal - $pokokModal) + $ongkosTotal) : 0,
            "berat" => $beratTotal,
            "subtotal" => rupiah($subTotal),
            "ongkos" => rupiah($ongkosTotal),
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function filterLabaRugi()
    {
        error_reporting(0);
        $status = $this->input->post('status_bayar', TRUE, NULL);
        $user = $this->input->post('user', TRUE, NULL);
        $pelanggan = $this->input->post('pelanggan', TRUE, NULL);
        if ($status == 1) {
            $col = 'status_bayar';
            $val = 1;
        } elseif ($status == 2) {
            $col = 'status_bayar';
            $val = 2;
        } else {
            $col = 'faktur IS NOT NULL';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $list = $this->penjualanModel->get_datatables_filter($col, $val, $startDate, $endDate, $user, $pelanggan);
        $beratTotal = $this->laporanModel->queryManualPerbarang('Penjualan', 'SUM(DISTINCT berat)', $startDate, $endDate, $user, $pelanggan);
        $pokokModal = $this->penjualanModel->sumWherePenjualanFilter('pokok_modal', $startDate, $endDate, $user, $pelanggan);
        $ongkosTotal = $this->penjualanModel->sumWherePenjualanFilter('ongkos', $startDate, $endDate, $user, $pelanggan);
        $grandTotal = $this->penjualanModel->sumWherePenjualanFilter('total', $startDate, $endDate, $user, $pelanggan);
        $subTotal = ($grandTotal - $ongkosTotal);
        $data = array();
        $no = 1;
        foreach ($beratTotal as $row) {
            $dataBeraTot[] = $row->result;
        }
        foreach ($list as $field) {
            $row = array();
            $ongkos = sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $subtotal = $field->grand_total - sumWhere('penjualan_detail', 'ongkos', 'faktur', $field->faktur);
            $labaRugi = $subtotal - $field->pokok_modal;
            $row[] = $no++;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = time_indo($field->created_at);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($subtotal);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($field->grand_total);
            $row[] = rupiah($field->pokok_modal);
            $row[] = rupiah($labaRugi);
            $row[] = rupiah($labaRugi + $ongkos);

            $data[] = $row;
        }

        $output = array(
            "pokok_modal" => ($pokokModal != null) ? rupiah($pokokModal) : 0,
            "labarugi" => ($subTotal != null) ? rupiah($subTotal - $pokokModal) : 0,
            "labarugi_ongkos" => ($ongkosTotal != null) ? rupiah(($subTotal - $pokokModal) + $ongkosTotal) : 0,
            "berat" => ($dataBeraTot == null) ? 0 : round(array_sum($dataBeraTot), 2),
            "subtotal" => rupiah($subTotal),
            "ongkos" => rupiah($ongkosTotal),
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered_filter($col, $val, $startDate, $endDate, $user, $pelanggan),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getListDetail()
    {
        $nota = $this->input->post('faktur', TRUE, NULL);
        $checkNota = checkFaktur('penjualan', 'faktur', $nota);
        if ($checkNota > 0) {
            $list = $this->penjualanModel->getDetail($nota);
            $data = array();
            foreach ($list as $field) {
                $data[] = array(
                    "id" => $field->id,
                    "id_barang" => $field->id_barang,
                    "kode_barang" => $field->kode_barang,
                    "jenis_barang" => getBarangID($field->kode_barang, 'jenis_barang'),
                    "nama_barang" => getBarangID($field->kode_barang, 'nama_barang'),
                    "foto" => getBarangID($field->kode_barang, 'foto'),
                    "berat" => getBarangID($field->kode_barang, 'berat'),
                    "kadar" => getBarangID($field->kode_barang, 'kadar'),
                    "potongan" => getPengaturan('harga_potongan'),
                    "total" => rupiah($field->harga),
                    "check" => checkData('beli_kembali_detail', 'kode_barang', $field->kode_barang, $this->userID),
                    "checkBuyback" => checkDataBuyback('penjualan_detail', 'kode_barang', $field->kode_barang, $nota),
                );
            }
            echo json_encode($data);
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'No. Nota tidak ada di database!'
            );
            echo json_encode($output);
        }
    }

    public function destroyTransactions()
    {
        $userId = $this->userID;
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $kodeFaktur = explode('.', $faktur);
        $kodeFaktur = $kodeFaktur[0];
        if ($kodeFaktur == 'PJ') {
            echo json_encode($this->penjualanModel->delTransactions($faktur));
        } else {
            echo json_encode($this->penjualanModel->delTransactionsQuantity($faktur));
        }
        $this->LogActivity_model->saveLog($userId);
    }

    public function destroyDetailTransactions()
    {
        $userId = $this->userID;
        $kode_barang = $this->input->post('kode_barang', TRUE, NULL);
        $faktur = $this->input->post('faktur', TRUE, NULL);
        echo json_encode($this->penjualanModel->delDetailTransactions($kode_barang, $faktur));
        $this->LogActivity_model->saveLog($userId);
    }

    function getCheckData()
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $countDetail = countWhere('penjualan_detail', 'faktur', $faktur);
        $list = $this->penjualanModel->getDetail($faktur);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "markup_harga" => $field->markup_harga
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            echo $i . ' Markup Harga : ' . $data[$i]['markup_harga'];
        }
    }

    public function saveFoto()
    {
        $fotoProses = $this->penjualanModel->saveFoto();
        echo json_encode($fotoProses);
    }

    function getNotaByKode()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $nota = getRowField('penjualan_detail', 'kode_barang', $kodeBarang, 'faktur');
        $output = array(
            "data" => $nota
        );
        echo json_encode($output);
    }

    // Transaksi Penjualan Gram
    function getFakturNota()
    {
        error_reporting(0);
        $nota = $this->input->post('faktur', TRUE, NULL);
        $list = $this->penjualanModel->getDetail($nota);
        $head = $this->penjualanModel->getHead($nota);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id" => $field->id,
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "jenis_barang" => getBarangID($field->kode_barang, 'jenis_barang'),
                "nama_barang" => getBarangID($field->kode_barang, 'nama_barang'),
                "foto" => getBarangID($field->kode_barang, 'foto'),
                "berat" => getBarangID($field->kode_barang, 'berat'),
                "kadar" => getBarangID($field->kode_barang, 'kadar'),
                "harga" => rupiah($field->harga),
                "sub_total" => rupiah($field->subtotal),
                "total" => rupiah($field->total),
                "check" => checkData('beli_kembali_detail', 'kode_barang', $field->kode_barang, $this->userID),
                "checkBuyback" => checkDataBuyback('penjualan_detail', 'kode_barang', $field->kode_barang, $nota),
            );
        }
        foreach ($head as $headField) {
            $ongkosTotal = sumWhere('penjualan_detail', 'ongkos', 'faktur', $nota);
            $dataHead = array(
                "faktur" => $headField->faktur,
                "nama_pelanggan" => getPelangganID($headField->pelanggan_id, "nama_pelanggan"),
                "alamat_pelanggan" => getPelangganID($headField->pelanggan_id, "alamat"),
                "date" => longdate_indo($headField->date),
                "dateShort" => shortdate_indo($field->date),
                "grand_total" => rupiah($headField->grand_total),
                "bayar" => rupiah($headField->bayar),
                "kembali" => rupiah($headField->kembali),
                "kasir" => getUserID($headField->user_id, "nama_user"),
                "status_bayar" => $headField->status_bayar,
                "subtotal" => rupiah($headField->grand_total - $ongkosTotal),
                "ongkosTotal" => rupiah($ongkosTotal),
                "terbilang" => "#" . $this->terbilang($headField->grand_total) . " rupiah #"
            );
        }
        $output = array(
            "headJual" => $dataHead,
            "detailJual" => $data,
        );
        echo json_encode($output);
    }

    function getFakturLabarugi()
    {
        error_reporting(0);
        $nota = $this->input->post('faktur', TRUE, NULL);
        $list = $this->penjualanModel->getDetail($nota);
        $head = $this->penjualanModel->getHead($nota);
        $data = array();
        foreach ($list as $field) {
            $subtotal = $field->total - $field->ongkos;
            $labaRugi = $field->total - getBarangID($field->kode_barang, 'nilai_beli');
            $data[] = array(
                "id" => $field->id,
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "jenis_barang" => getBarangID($field->kode_barang, 'jenis_barang'),
                "nama_barang" => getBarangID($field->kode_barang, 'nama_barang'),
                "foto" => getBarangID($field->kode_barang, 'foto'),
                "berat" => getBarangID($field->kode_barang, 'berat'),
                "kadar" => getBarangID($field->kode_barang, 'kadar'),
                "harga" => rupiah($field->harga),
                "total" => rupiah($field->total),
                "check" => checkData('beli_kembali_detail', 'kode_barang', $field->kode_barang, $this->userID),
                "checkBuyback" => checkDataBuyback('penjualan_detail', 'kode_barang', $field->kode_barang, $nota),
                "hargaModal" => rupiah(getBarangID($field->kode_barang, 'harga_beli')),
                "pokokModal" => rupiah(getBarangID($field->kode_barang, 'nilai_beli')),
                "labaRugi" => rupiah($labaRugi),
                "ongkos" => rupiah($field->ongkos),
                "labaOngkos" => rupiah($labaRugi + $field->ongkos),
            );
        }
        foreach ($head as $headField) {
            $ongkosTotal = sumWhere('penjualan_detail', 'ongkos', 'faktur', $nota);
            $subtotal = $headField->grand_total;
            $labaRugi = $subtotal - $this->penjualanModel->sumPokokModal($headField->faktur);
            $dataHead = array(
                "faktur" => $headField->faktur,
                "nama_pelanggan" => getPelangganID($headField->pelanggan_id, "nama_pelanggan"),
                "alamat_pelanggan" => getPelangganID($headField->pelanggan_id, "alamat"),
                "date" => longdate_indo($headField->date),
                "grand_total" => rupiah($headField->grand_total + $ongkosTotal),
                "bayar" => rupiah($headField->bayar),
                "kembali" => rupiah($headField->kembali),
                "kasir" => getUserID($headField->user_id, "nama_user"),
                "status_bayar" => $headField->status_bayar,
                "subtotal" => rupiah($subtotal),
                "ongkosTotal" => rupiah($ongkosTotal),
                "pokokModal" => rupiah($this->penjualanModel->sumPokokModal($headField->faktur)),
                "labaRugi" => rupiah($labaRugi),
                "labaOngkos" => rupiah($labaRugi + $ongkosTotal)
            );
        }
        $output = array(
            "headJual" => $dataHead,
            "detailJual" => $data,
        );
        echo json_encode($output);
    }

    function getPenjualanDetail($kasir_id)
    {
        error_reporting(0);
        $list = $this->penjualanModel->get_datatables_detail($this->userID);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id_barang;
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = getBarangID($field->kode_barang, 'berat');
            $row[] = getBarangID($field->kode_barang, 'kadar');
            $row[] = rupiah($field->harga);
            $row[] = rupiah($field->ongkos);
            $row[] = rupiah($field->subtotal);
            $row[] = getBarangID($field->kode_barang, 'foto');
            $row[] = $field->markup_harga;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all_detail(),
            "recordsFiltered" => $this->penjualanModel->count_filtered_detail($this->userID),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function updateDetail()
    {
        echo json_encode($this->penjualanModel->updateDetail());
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function updateQtyDetail()
    {
        echo json_encode($this->penjualanModel->updateQty());
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->penjualanModel->rules());
        $userId = $this->userID;
        $checkJualDet = checkData('penjualan_detail', 'faktur', '-', $userId);
        if ($checkJualDet > 0) {
            if ($validation->run()) {
                $statusBayar = htmlspecialchars($this->input->post('status_bayar'));
                if ($statusBayar == 1) {
                    echo json_encode($this->penjualanModel->addTransactionsTunai($userId));
                } elseif ($statusBayar == 2) {
                    echo json_encode($this->penjualanModel->addTransactionsCredit($userId));
                }
                $this->LogActivity_model->saveLog($userId);
            }
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'Tidak ada barang di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function storeDetail()
    {
        $userId = $this->userID;
        $checkCart = checkData('penjualan_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')), $userId);
        if ($checkCart == 0) {
            echo json_encode($this->penjualanModel->addTransactionsDetail($userId));
            $this->LogActivity_model->saveLog($userId);
        } else {
            $output = array(
                "status" => FALSE,
                "check" => $checkCart,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah ada di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function destroyDetail()
    {
        $userId = $this->userID;
        $checkStatus = checkStatusDetail('penjualan_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        if ($checkStatus > 0) {
            echo json_encode($this->penjualanModel->delTransactionsDetail($userId));
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah di proses!'
            );
            echo json_encode($output);
        }
        $this->LogActivity_model->saveLog($userId);
    }

    // Transaksi Penjualan Quantity
    function getFakturNotaQuantity()
    {
        error_reporting(0);
        $nota = $this->input->post('faktur', TRUE, NULL);
        $list = $this->penjualanModel->getDetailQuantity($nota);
        $head = $this->penjualanModel->getHead($nota);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id" => $field->id,
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "jenis_barang" => getBarangID($field->kode_barang, 'jenis_barang'),
                "nama_barang" => getBarangID($field->kode_barang, 'nama_barang'),
                "harga" => rupiah($field->harga),
                "qty" => $field->qty,
                "total" => rupiah($field->total)
            );
        }
        foreach ($head as $headField) {
            $dataHead = array(
                "faktur" => $headField->faktur,
                "nama_pelanggan" => getPelangganID($headField->pelanggan_id, "nama_pelanggan"),
                "alamat_pelanggan" => getPelangganID($headField->pelanggan_id, "alamat"),
                "date" => longdate_indo($headField->date),
                "grand_total" => rupiah($headField->grand_total),
                "bayar" => rupiah($headField->bayar),
                "kembali" => rupiah($headField->kembali),
                "kasir" => getUserID($headField->user_id, "nama_user"),
                "status_bayar" => $headField->status_bayar,
            );
        }
        $output = array(
            "headJual" => $dataHead,
            "detailJual" => $data,
        );
        echo json_encode($output);
    }

    function getQuantityDetail($kasir_id)
    {
        error_reporting(0);
        $list = $this->penjualanModel->get_datatables_quantity_detail($this->userID);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id_barang;
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = rupiah($field->harga);
            $row[] = $field->qty;
            $row[] = rupiah($field->total);
            $row[] = $field->harga;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all_quantity_detail(),
            "recordsFiltered" => $this->penjualanModel->count_filtered_quantity_detail($this->userID),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function storeQuantity()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->penjualanModel->rules());
        $userId = $this->userID;
        $checkQuantityDet = checkData('quantity_detail', 'faktur', '-', $userId);
        if ($checkQuantityDet > 0) {
            if ($validation->run()) {
                $statusBayar = htmlspecialchars($this->input->post('status_bayar'));
                if ($statusBayar == 1) {
                    echo json_encode($this->penjualanModel->addTransactionsQuantityTunai($userId));
                } elseif ($statusBayar == 2) {
                    echo json_encode($this->penjualanModel->addTransactionsQuantityCredit($userId));
                }
                $this->LogActivity_model->saveLog($userId);
            }
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'Tidak ada barang di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function storeQuantityDetail()
    {
        $userId = $this->userID;
        $checkCart = checkData('quantity_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')), $userId);
        if ($checkCart == 0) {
            echo json_encode($this->penjualanModel->addTransactionsQuantityDetail($userId));
            $this->LogActivity_model->saveLog($userId);
        } else {
            $output = array(
                "status" => FALSE,
                "check" => $checkCart,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah ada di keranjang!'
            );
            echo json_encode($output);
        }
    }

    public function destroyQuantityDetail()
    {
        $userId = $this->userID;
        $checkStatus = checkStatusDetail('quantity_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        if ($checkStatus > 0) {
            echo json_encode($this->penjualanModel->delTransactionsQuantityDetail($userId));
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah di proses!'
            );
            echo json_encode($output);
        }
        $this->LogActivity_model->saveLog($userId);
    }

    public function infoTransaksiPenjualan()
    {
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $totalOngkos = $this->penjualanModel->sumWherePenjualan('penjualan_detail', 'ongkos', 'faktur IS NOT NULL', null, $startDate, $endDate, 'date');
        $total = $this->penjualanModel->sumWherePenjualan('penjualan_detail', 'total', 'faktur IS NOT NULL', null, $startDate, $endDate, 'date');
        $subtotal = $total - $totalOngkos;
        $output = array(
            "totalBerat" => round($this->penjualanModel->sumWherePenjualan('data_barang', 'berat', 'status', 'J', $startDate, $endDate, 'updated_at'), 2),
            "subtotalPenjualan" => rupiah($subtotal),
            "totalOngkos" => rupiah($totalOngkos),
            "totalPenjualan" => rupiah($total),
            "jumlahNota" => $this->penjualanModel->countNota('penjualan', $startDate, $endDate),
        );
        echo json_encode($output);
    }

    private function terbilang($nilai)
    {
        $nilai = abs($nilai);
        $huruf = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
        $temp = "";
        if ($nilai < 12) {
            $temp = " " . $huruf[$nilai];
        } else if ($nilai < 20) {
            $temp = $this->terbilang($nilai - 10) . " belas";
        } else if ($nilai < 100) {
            $temp = $this->terbilang($nilai / 10) . " puluh" . $this->terbilang($nilai % 10);
        } else if ($nilai < 200) {
            $temp = " seratus" . $this->terbilang($nilai - 100);
        } else if ($nilai < 1000) {
            $temp = $this->terbilang($nilai / 100) . " ratus" . $this->terbilang($nilai % 100);
        } else if ($nilai < 2000) {
            $temp = " seribu" . $this->terbilang($nilai - 1000);
        } else if ($nilai < 1000000) {
            $temp = $this->terbilang($nilai / 1000) . " ribu" . $this->terbilang($nilai % 1000);
        } else if ($nilai < 1000000000) {
            $temp = $this->terbilang($nilai / 1000000) . " juta" . $this->terbilang($nilai % 1000000);
        } else if ($nilai < 1000000000000) {
            $temp = $this->terbilang($nilai / 1000000000) . " milyar" . $this->terbilang(fmod($nilai, 1000000000));
        } else if ($nilai < 1000000000000000) {
            $temp = $this->terbilang($nilai / 1000000000000) . " trilyun" . $this->terbilang(fmod($nilai, 1000000000000));
        }
        return $temp;
    }
}
