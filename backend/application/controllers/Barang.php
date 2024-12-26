<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Barang extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("Barang_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
        $this->load->helper('rupiah_helper');
        $this->load->helper('data_helper');
    }

    function getBarang()
    {
        error_reporting(0);
        $status = $this->input->post('status', TRUE, NULL);
        if ($status == 1) {
            $valStatus = 'stok';
        } elseif ($status == 3) {
            $valStatus = 'J';
        } elseif ($status == 4) {
            $valStatus = 'S';
        } elseif ($status == 5) {
            $valStatus = 'R';
        }
        $jenisValue = $this->input->post('jenis_barang', TRUE, NULL);
        $list = $this->Barang_model->get_datatables($jenisValue, $valStatus);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->kadar;
            $row[] = $field->status;
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->harga_jual);
            $row[] = $field->foto;
            $row[] = $field->stok;

            $data[] = $row;
        }

        $output = array(
            "berat" => round($this->Barang_model->sumWhereBarang('data_barang', 'berat', 'jenis_barang', $jenisValue, $valStatus), 2),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all(),
            "recordsFiltered" => $this->Barang_model->count_filtered($jenisValue, $valStatus),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function filterBarang()
    {
        error_reporting(0);
        $valStatus = $this->input->post('status', TRUE, NULL);
        if ($valStatus == 'nol') {
            $valStatus = '0';
        }
        //  elseif ($status == 2) {
        //     $valStatus = '1';
        // } elseif ($status == 3) {
        //     $valStatus = 'J';
        // } elseif ($status == 4) {
        //     $valStatus = 'S';
        // } elseif ($status == 5) {
        //     $valStatus = 'R';
        // }
        $jenisValue = $this->input->post('jenis_barang', TRUE, NULL);
        $list = $this->Barang_model->get_datatables($jenisValue, $valStatus);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->kadar;
            $row[] = $field->status;
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->harga_jual);
            $row[] = $field->foto;
            $row[] = $field->stok;

            $data[] = $row;
        }

        $output = array(
            "berat" => round($this->Barang_model->sumWhereBarang('data_barang', 'berat', 'jenis_barang', $jenisValue, $valStatus), 2),
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all(),
            "recordsFiltered" => $this->Barang_model->count_filtered($jenisValue, $valStatus),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function getBarangRow()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $jenisBarang = $this->input->post('jenis_barang', TRUE, NULL);
        echo json_encode($this->Barang_model->getBarangById($kodeBarang, $jenisBarang));
    }

    public function getBarangRowQuantity()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $data = $this->Barang_model->getBarangByIdQuantity($kodeBarang);
        echo json_encode($data);
    }

    function getBarangInstok()
    {
        error_reporting(0);
        $jenisBarang = $this->input->post('jenis_barang', TRUE, NULL);
        $list = $this->Barang_model->get_datatables_instok($jenisBarang);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->status;
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->harga_jual);
            $row[] = $field->foto;
            $row[] = $field->stok;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all_instok(),
            "recordsFiltered" => $this->Barang_model->count_filtered_instok($jenisBarang),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getBarangQuantity()
    {
        error_reporting(0);
        $list = $this->Barang_model->get_datatables_quantity();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->status;
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->harga_jual);
            $row[] = $field->foto;
            $row[] = $field->stok;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all_quantity(),
            "recordsFiltered" => $this->Barang_model->count_filtered_quantity(),
            "data" => $data,
        );

        echo json_encode($output);
    }

    function getBarangBarcode()
    {
        error_reporting(0);
        $this->load->helper('tgl_indo_helper');
        $mode = $this->input->post('mode', TRUE, NULL);
        $jenisBarang = $this->input->post('jenis_barang', TRUE, NULL);
        if ($mode == 1) {
            $col = 'status';
            $val = '1';
        } elseif ($mode == 2) {
            $col = 'status';
            $val = '0';
        } elseif ($mode == 3) {
            $col = 'status';
            $val = 'S';
        } elseif ($mode == 4) {
            $col = 'status';
            $val = 'R';
        } else {
            $col = 'kode_barang IS NOT NULL';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $list = $this->Barang_model->get_datatables_barcode($col, $val, $startDate, $endDate, $jenisBarang);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->kadar;
            $row[] = rupiah($field->harga_jual);
            $row[] = $field->status;
            $row[] = $field->updated_at;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all_barcode(),
            "recordsFiltered" => $this->Barang_model->count_filtered_barcode($col, $val, $startDate, $endDate, $jenisBarang),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getBarangRusak()
    {
        error_reporting(0);
        $list = $this->Barang_model->get_datatables_rusak();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->kadar;
            $row[] = $field->status;
            $row[] = rupiah($field->harga_beli);
            $row[] = rupiah($field->harga_jual);

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Barang_model->count_all_rusak(),
            "recordsFiltered" => $this->Barang_model->count_filtered_rusak(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function changeStatusBarang()
    {
        $this->Barang_model->changeStatus();
    }

    public function changeDataBarang()
    {
        $this->Barang_model->changeData();
        echo json_encode(TRUE);
    }

    public function store()
    {
        $barang = $this->Barang_model;
        $validation = $this->form_validation;
        $validation->set_rules($barang->rules());

        if ($validation->run()) {
            echo json_encode($barang->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $barang = $this->Barang_model;
        $validation = $this->form_validation;
        $validation->set_rules($barang->rules());

        if ($validation->run()) {
            echo json_encode($barang->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Barang_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
