<?php defined('BASEPATH') or exit('No direct script access allowed');

class Piutang_model extends CI_Model
{
    var $tablePiutang = 'piutang';
    var $tableFaktur = 'faktur';
    var $column_order = array('id', 'created_at', 'faktur_jual', 'pelanggan_id', 'piutang', 'piutang_sisa', 'tempo', 'user_id');
    var $column_search = array('id', 'faktur_jual');
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
            ],
            [
                'field' => 'faktur_jual',
                'label' => 'Faktur Jual',
                'rules' => 'required'
            ]
        ];
    }

    // Get Table Piutang Head
    private function _get_datatables_query($col, $val)
    {
        $this->db->from($this->tablePiutang);
        $this->db->where($col, $val);

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

    function get_datatables($col, $val)
    {
        $this->_get_datatables_query($col, $val);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered($col, $val)
    {
        $this->_get_datatables_query($col, $val);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tablePiutang);
        return $this->db->count_all_results();
    }

    public function getPiutangRow($fakturJual)
    {
        return $this->db->get_where($this->tablePiutang, ['faktur_jual' => $fakturJual])->row();
    }

    public function addTransactions($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $fakturJual = htmlspecialchars($this->input->post('faktur_jual'));
        $piutangTerbayar = $this->input->post('piutang_terbayar', TRUE, 0);
        $bayarTunai = $this->input->post('bayar_tunai', TRUE, 0);
        $piutangSisa = $this->input->post('piutang_sisa', TRUE, 0);
        $dataPiutang = array(
            'piutang_dibayar' => $piutangTerbayar + $bayarTunai,
            'piutang_sisa' => $piutangSisa,
            'user_id' => $userID,
            'updated_at' => date('Y-m-d')
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $bayarTunai,
            'pengeluaran' => 0,
            'grand_total' => $bayarTunai,
            'mode' => 'Bayar Piutang',
            'referensi' => 'BP',
            'source' => '1101',
            'keterangan' => 'Bayar Piutang : ' . $fakturJual,
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Update Data Piutang
        $this->db->where('faktur_jual', $fakturJual);
        $this->db->update($this->tablePiutang, $dataPiutang);
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
}
