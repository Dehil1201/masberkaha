<?php defined('BASEPATH') or exit('No direct script access allowed');

class JasaServis_model extends CI_Model
{
    var $tableHead = 'jasa_servis';
    var $tableFaktur = 'faktur';
    var $tableBarang = 'data_barang';
    var $column_order = array('id', 'faktur', 'date', 'grand_total', 'user_id', 'status_servis');
    var $column_search = array('id', 'faktur');
    var $order = array('id' => 'asc');

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function rules()
    {
        return [
            [
                'field' => 'faktur',
                'label' => 'Faktur',
                'rules' => 'required'
            ]
        ];
    }

    // Get Table JasaServis Head
    private function _get_datatables_query()
    {
        $this->db->from($this->tableHead);
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables()
    {
        $this->_get_datatables_query();
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered()
    {
        $this->_get_datatables_query();
        $query = $this->db->get();
        return $query->num_rows();
    }

    private function _get_datatables_query_filter($startDate, $endDate)
    {
        $this->db->from($this->tableHead);
        $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_filter($startDate, $endDate)
    {
        $this->_get_datatables_query_filter($startDate, $endDate);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($startDate, $endDate)
    {
        $this->_get_datatables_query_filter($startDate, $endDate);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableHead);
        return $this->db->count_all_results();
    }

    public function addTransactions($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = $this->input->post('grand_total', TRUE, 0);
        $dataJasaServis = array(
            'faktur' => $faktur,
            'pelanggan_id' => $this->input->post('pelanggan_id', TRUE, 0),
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'grand_total' => $grandTotal,
            'bayar' => $this->input->post('bayar', TRUE, 0),
            'kembali' => $this->input->post('kembali', TRUE, 0),
            'user_id' => $userID,
            'kerusakan' => $this->input->post('kerusakan', TRUE, NULL),
            'status_servis' => $this->input->post('status_servis', TRUE, 1),
            'keterangan' => 'Jasa Servis : ' . $faktur
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'pengeluaran' => 0,
            'grand_total' => $grandTotal,
            'mode' => 'Jasa Servis',
            'referensi' => 'JS',
            'keterangan' => 'Jasa Servis : ' . $faktur
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data JasaServis
        $this->db->insert($this->tableHead, $dataJasaServis);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function changeStatusBarang($status, $kodeBarang)
    {
        $data = array(
            'status' => $status
        );
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, $kodeBarang));
        return $this->db->update($this->tableBarang, $data);
    }
}
