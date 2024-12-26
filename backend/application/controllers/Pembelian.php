<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Pembelian extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Pembelian_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->pembelianModel = $this->Pembelian_model;
    }

    function getPembelian()
    {
        error_reporting(0);
        $beratTotal = round($this->pembelianModel->sumAllBeratPembelian(), 2);
        $grandTotal = $this->pembelianModel->sumWherePembelian('pembelian', 'grand_total', 'faktur IS NOT NULL');
        $list = $this->pembelianModel->get_datatables();
        $no = 1;
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $no++;
            $row[] = $field->faktur;
            $row[] = shortdate_indo($field->date);
            $row[] = time_indo($field->created_at);
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($field->grand_total);
            $row[] = getSupplierID($field->supplier_id, 'nama_supplier');
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "berat" => $beratTotal,
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->pembelianModel->count_all(),
            "recordsFiltered" => $this->pembelianModel->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function filterPembelian()
    {
        error_reporting(0);
        $status = $this->input->post('status_bayar', TRUE, NULL);
        $user = $this->input->post('user', TRUE, NULL);
        $supplier = $this->input->post('supplier', TRUE, NULL);
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
        $list = $this->pembelianModel->get_datatables_filter($col, $val, $startDate, $endDate, $user, $supplier);
        $beratTotal = round($this->pembelianModel->sumAllBeratPembelian($startDate, $endDate, $user, $supplier), 2);
        $grandTotal = $this->pembelianModel->sumWherePembelianFilter('total', $startDate, $endDate, $user, $supplier);
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $row[] = $no++;
            $row[] = $field->faktur;
            $row[] = shortdate_indo($field->date);
            $row[] = time_indo($field->created_at);
            $row[] = round($field->total_berat, 2);
            $row[] = rupiah($field->grand_total);
            $row[] = getSupplierID($field->supplier_id, 'nama_supplier');
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = $field->keterangan;
            $data[] = $row;
        }

        $output = array(
            "berat" => $beratTotal,
            "grand_total" => rupiah($grandTotal),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->pembelianModel->count_all(),
            "recordsFiltered" => $this->pembelianModel->count_filtered_filter($col, $val, $startDate, $endDate, $user, $supplier),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getPembelianDetail()
    {
        error_reporting(0);
        $list = $this->pembelianModel->get_datatables_detail($this->userID);
        $data = array();
        $no = 0;
        foreach ($list as $field) {
            $no++;
            $row = array();
            $row[] = $no;
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = getBarangID($field->kode_barang, 'berat');
            $row[] = getBarangID($field->kode_barang, 'kadar');
            $row[] = rupiah(getBarangID($field->kode_barang, 'harga_beli'));
            $row[] = rupiah($field->total);
            $row[] = rupiah(getBarangID($field->kode_barang, 'harga_jual'));
            $row[] = $field->qty;
            $row[] = getBarangID($field->kode_barang, 'foto');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->pembelianModel->count_all_detail(),
            "recordsFiltered" => $this->pembelianModel->count_filtered_detail($this->userID),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->pembelianModel->rules());

        $checkBeliDet = checkData('pembelian_detail', 'faktur', '-', $this->userID);
        if ($checkBeliDet > 0) {
            if ($validation->run()) {
                $statusBayar = htmlspecialchars($this->input->post('status_bayar'));
                if ($statusBayar == 1) {
                    echo json_encode($this->pembelianModel->addTransactionsTunai($this->userID));
                } elseif ($statusBayar == 2) {
                    echo json_encode($this->pembelianModel->addTransactionsCredit($this->userID));
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

    public function storeDetail()
    {
        $checkCart = checkData('pembelian_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')), $this->userID);
        if ($checkCart == 0) {
            echo json_encode($this->pembelianModel->addTransactionsDetail($this->userID));
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
        $checkStatus = checkStatusDetail('pembelian_detail', 'kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        if ($checkStatus > 0) {
            echo json_encode($this->pembelianModel->delTransactionsDetail($this->userID));
        } else {
            $output = array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah di proses!'
            );
            echo json_encode($output);
        }
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function infoTransaksiPembelian()
    {
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $total = $this->pembelianModel->sumWherePembelian('pembelian_detail', 'total', 'faktur IS NOT NULL', null, $startDate, $endDate, 'date');
        $output = array(
            "totalBerat" => round($this->pembelianModel->sumWherePembelian('data_barang', 'berat', 'status', '0', $startDate, $endDate, 'updated_at'), 2),
            "totalPembelian" => rupiah($total),
            "jumlahNota" => $this->pembelianModel->countNota('pembelian', $startDate, $endDate),
        );
        echo json_encode($output);
    }

    function getFakturNota()
    {
        error_reporting(0);
        $nota = $this->input->post('faktur', TRUE, NULL);
        $list = $this->pembelianModel->getDetail($nota);
        $head = $this->pembelianModel->getHead($nota);
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
                "total" => rupiah($field->total),
            );
        }
        foreach ($head as $headField) {
            $dataHead = array(
                "faktur" => $headField->faktur,
                "nama_supplier" => getSupplierID($headField->supplier_id, "nama_supplier"),
                "alamat_supplier" => getSupplierID($headField->supplier_id, "alamat"),
                "date" => longdate_indo($headField->date),
                "grand_total" => rupiah($headField->grand_total),
                "kasir" => getUserID($headField->user_id, "nama_user"),
                "status_bayar" => $headField->status_bayar,
            );
        }
        $output = array(
            "headBeli" => $dataHead,
            "detailBeli" => $data,
        );
        echo json_encode($output);
    }

    public function destroyTransactions()
    {
        $userId = $this->userID;
        $faktur = $this->input->post('faktur', TRUE, NULL);
        echo json_encode($this->pembelianModel->delTransactions($faktur));
        $this->LogActivity_model->saveLog($userId);
    }

    public function destroyDetailTransactions()
    {
        $userId = $this->userID;
        $kode_barang = $this->input->post('kode_barang', TRUE, NULL);
        $faktur = $this->input->post('faktur', TRUE, NULL);
        echo json_encode($this->pembelianModel->delDetailTransactions($kode_barang, $faktur));
        $this->LogActivity_model->saveLog($userId);
    }
}
