<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Datahelper extends CI_Controller

{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->userID = $this->session->userdata('userID');
        $this->load->model("DataHelper_model");
    }

    public function autoKodePelanggan()
    {
        $data = array(
            'data' => $this->DataHelper_model->autoKode("pelanggan", "kode_pelanggan", "TMA")
        );
        echo json_encode($data);
    }

    public function autoKodeBarang()
    {
        $kodeJenis = $this->input->post('kode_jenis', TRUE, null);
        $data = array(
            'data' => $this->DataHelper_model->autoKode("data_barang", "kode_barang", $kodeJenis)
        );
        echo json_encode($data);
    }

    public function autoFakturKas()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("KAS")
        );
        echo json_encode($data);
    }

    public function autoFakturTransfer()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("TF")
        );
        echo json_encode($data);
    }

    public function autoFakturJual()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("PJ")
        );
        echo json_encode($data);
    }

    public function autoFakturQuantity()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("PJQ")
        );
        echo json_encode($data);
    }

    public function autoFakturBeli()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("PB")
        );
        echo json_encode($data);
    }

    public function autoFakturBeliKembali()
    {
        $BK = explode('.', htmlspecialchars($this->input->post('notaPenjualan')));
        $BK = $BK[2];
        $data = array(
            'data' => $this->DataHelper_model->fakturData("BK", $BK)
        );
        echo json_encode($data);
    }

    public function autoFakturBuybackOldstok()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("BK")
        );
        echo json_encode($data);
    }

    public function autoFakturServis()
    {
        $data = array(
            'data' => $this->DataHelper_model->fakturID("JS")
        );
        echo json_encode($data);
    }

    public function autoFakturHutang()
    {
        $BH = explode('.', htmlspecialchars($this->input->post('fakturBeli')));
        $BH = $BH[2];
        $data = array(
            'data' => $this->DataHelper_model->fakturData("BH", $BH)
        );
        echo json_encode($data);
    }

    public function autoFakturPiutang()
    {
        $BP = explode('.', htmlspecialchars($this->input->post('fakturJual')));
        $BP = $BP[2];
        $data = array(
            'data' => $this->DataHelper_model->fakturData("BP", $BP)
        );
        echo json_encode($data);
    }

    public function checkData()
    {
        echo $this->DataHelper_model->checkData('penjualan_detail', 'A748');
    }

    public function countWhereBarang($status = NULL)
    {
        echo $this->DataHelper_model->countWhereBarang('data_barang', 'status', $status);
    }

    public function sumData()
    {
        echo $this->DataHelper_model->sumData('pembelian_detail', 'total', $this->userID);
    }

    public function sumBuyback()
    {
        if ($this->DataHelper_model->sumData('beli_kembali_detail', 'total', $this->userID) === NULL) {
            echo 0;
        } else {
            echo round($this->DataHelper_model->sumData('beli_kembali_detail', 'total', $this->userID));
        }
    }

    public function getIpClient()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public function openCashDrawer()
    {
        $handle = fopen("PRN", "w"); // note 1
        fwrite($handle, 'text to printer'); // note 2
        fwrite($handle, chr(27) . chr(112) . chr(0) . chr(100) . chr(250)); // note 3
        fclose($handle); // note 4
    }

    public function checkFoto($kodeBarang)
    {
        $this->load->helper('data_helper');
        $filename = getDataField('data_barang', 'kode_barang', $kodeBarang, 'foto');
        if (!file_exists(FCPATH . '/uploads/foto/' . $filename)) {
            $data = array(
                'foto' => null,
            );
            $this->db->where('kode_barang', $kodeBarang);
            $this->db->update('data_barang', $data);
            echo json_encode(null);
        } else {
            echo json_encode($filename);
        }
    }
}
