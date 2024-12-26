<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Referensiakuntan extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("Referensi_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->userID = $this->session->userdata('userID');
    }

    function getReferensi()
    {
        $list = $this->Referensi_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_referensi;
            $row[] = $field->nama_referensi;
            
            $row[] = ($field->tipe == 1) ? "Debit" : "Kredit";

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Referensi_model->count_all(),
            "recordsFiltered" => $this->Referensi_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function add()
    {
        $model = $this->Referensi_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->add());
        }
    }

    public function save()
    {
        $model = $this->Referensi_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->save());
        }
    }


    public function getAll()
    {
        $model = $this->Referensi_model;
        echo json_encode($model->get_all_data());
    }

    public function delete()
    {
        $id = $this->input->post('id');
        $data = $this->Referensi_model->delete($id);
        echo json_encode($data);
    }
}
