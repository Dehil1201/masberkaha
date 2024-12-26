<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Supplier extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Supplier_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getSupplier()
    {
        error_reporting(0);
        $list = $this->Supplier_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->nama_supplier;
            $row[] = $field->alamat;
            $row[] = $field->kota;
            $row[] = $field->no_hp;
            $row[] = $field->email;
            $row[] = $field->website;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Supplier_model->count_all(),
            "recordsFiltered" => $this->Supplier_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $supplier = $this->Supplier_model;
        $validation = $this->form_validation;
        $validation->set_rules($supplier->rules());

        if ($validation->run()) {
            echo json_encode($supplier->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $supplier = $this->Supplier_model;
        $validation = $this->form_validation;
        $validation->set_rules($supplier->rules());

        if ($validation->run()) {
            echo json_encode($supplier->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Supplier_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
