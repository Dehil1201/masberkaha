<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Jenisbarang extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("JenisBarang_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getJenisBarang()
    {
        error_reporting(0);
        $list = $this->JenisBarang_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->jenis_barang;
            $row[] = $field->kode_jenis;
            $row[] = $field->penjualan_satuan;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->JenisBarang_model->count_all(),
            "recordsFiltered" => $this->JenisBarang_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function getJenisBarangRow($jenis = NULL)
    {
        $decodeJenis = utf8_decode(urldecode($jenis));
        echo json_encode($this->JenisBarang_model->getJenisRow($decodeJenis));
    }

    public function store()
    {
        $jenis_barang = $this->JenisBarang_model;
        $validation = $this->form_validation;
        $validation->set_rules($jenis_barang->rules());

        if ($validation->run()) {
            echo json_encode($jenis_barang->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $jenis_barang = $this->JenisBarang_model;
        $validation = $this->form_validation;
        $validation->set_rules($jenis_barang->rules());

        if ($validation->run()) {
            echo json_encode($jenis_barang->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->JenisBarang_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
