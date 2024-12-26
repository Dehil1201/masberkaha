<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Saldo extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("Saldo_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->userID = $this->session->userdata('userID');
        $this->load->helper('rupiah_helper');
    }

    function getSaldo()
    {
        $list = $this->Saldo_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $debit = $this->Saldo_model->sumToday('faktur', 'pemasukan', "source", $field->no_rekening);
            $kredit = $this->Saldo_model->sumToday('faktur', 'pengeluaran', "source", $field->no_rekening);
            
            $saldoAkhir = $this->Saldo_model->sumWhere('saldo', 'saldo', 'no_rekening', $field->no_rekening);
            $saldoAwal = $saldoAkhir - ($debit - $kredit);
            $row[] = $field->id;
            $row[] = $field->no_rekening;
            $row[] = $field->an;
            $row[] = rupiah($saldoAwal);
            $row[] = rupiah($debit);
            $row[] = ($kredit != 0 ? "-" . rupiah($kredit) : rupiah($kredit));
            $row[] = rupiah($saldoAkhir);
            $row[] = $field->jenis;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Saldo_model->count_all(),
            "recordsFiltered" => $this->Saldo_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function add()
    {
        $model = $this->Saldo_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->add());
        }
    }

    public function save()
    {
        $model = $this->Saldo_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->save());
        }
    }

    function getDetailTransaksi()
    {
        error_reporting(0);
        $this->load->helper('tgl_indo_helper');
        $noRekening = $this->input->post('no_rekening', TRUE, NULL);
        $list = $this->Saldo_model->get_datatables_detail($noRekening);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->source;
            $row[] = $field->mode;
            $row[] = $field->keterangan;
            $row[] = rupiah($field->pemasukan);
            $row[] = $row[] = ($field->pengeluaran != 0 ? "-" . rupiah($field->pengeluaran) : rupiah($field->pengeluaran));

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Saldo_model->count_all_detail(),
            "recordsFiltered" => $this->Saldo_model->count_filtered_detail($noRekening),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function getSaldoByRekening()
    {
        $model = $this->Saldo_model;
        echo json_encode($model->get_saldo_by_rekening());
    }

    public function getAll()
    {
        $model = $this->Saldo_model;
        echo json_encode($model->get_all_data());
    }

    public function debit()
    {
        $model = $this->Saldo_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->debit());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }


    public function kredit()
    {
        $model = $this->Saldo_model;
        $validation = $this->form_validation;
        $validation->set_rules($model->rules());

        if ($validation->run()) {
            echo json_encode($model->kredit());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function delete()
    {
        $id = $this->input->post('id');
        $data = $this->Saldo_model->delete($id);
        echo json_encode($data);
    }
}
