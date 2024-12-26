<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Stok extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Stok_model");
        $this->load->library('datatables');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
    }

    function getCheckStok()
    {
        error_reporting(0);
        $status = $this->input->post('status_check', TRUE, NULL);
        if ($status === 1) {
            $col = 'status_check';
            $val = 1;
        } elseif ($status === 2) {
            $col = 'status_check';
            $val = 0;
        } else {
            $col = 'status_check';
            $val = 1;
        }
        $list = $this->Stok_model->get_datatables_filter($col, $val);
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
            $row[] = shortdate_indo($field->updated_at);

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Stok_model->count_all(),
            "recordsFiltered" => $this->Stok_model->count_filtered_filter($col, $val),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getStokUnchecked()
    {
        error_reporting(0);
        $list = $this->Stok_model->get_datatables_filter('status_check', 0);
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
            $row[] = shortdate_indo($field->last_check);

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Stok_model->count_all(),
            "recordsFiltered" => $this->Stok_model->count_filtered_filter('status_check', 0),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function checkBarang()
    {
        if ($this->Stok_model->checkDataBarang() === 0) {
            echo json_encode(array(
                "status" => FALSE,
                "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' tidak ada!'
            ));
        } else {
            if ($this->Stok_model->checkStatusCheckBarang() === 1) {
                echo json_encode(array(
                    "status" => FALSE,
                    "message" => 'kode barang: ' . $this->input->post('kode_barang') . ' sudah di check!'
                ));
            } else {
                echo json_encode($this->Stok_model->changeStatusCheck());
            }
        }
    }
    
    public function resetStatusCheck()
    {
        echo json_encode($this->Stok_model->setDefaultCheck());
    }
}
