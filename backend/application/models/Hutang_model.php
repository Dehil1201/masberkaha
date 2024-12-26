<?php defined('BASEPATH') or exit('No direct script access allowed');

class Hutang_model extends CI_Model
{
    var $tableHutang = 'hutang';
    var $tableFaktur = 'faktur';
    var $column_order = array('id', 'created_at', 'faktur_beli', 'supplier_id', 'hutang', 'hutang_sisa', 'tempo', 'user_id');
    var $column_search = array('id', 'faktur_beli');
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
                'field' => 'faktur_beli',
                'label' => 'Faktur Beli',
                'rules' => 'required'
            ]
        ];
    }

    // Get Table Hutang Head
    private function _get_datatables_query($col, $val)
    {
        $this->db->from($this->tableHutang);
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
        $this->db->from($this->tableHutang);
        return $this->db->count_all_results();
    }

    public function getHutangRow($fakturBeli)
    {
        return $this->db->get_where($this->tableHutang, ['faktur_beli' => $fakturBeli])->row();
    }

    public function addTransactions($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $fakturBeli = htmlspecialchars($this->input->post('faktur_beli'));
        $hutangTerbayar = $this->input->post('hutang_terbayar', TRUE, 0);
        $bayarTunai = $this->input->post('bayar_tunai', TRUE, 0);
        $hutangSisa = $this->input->post('hutang_sisa', TRUE, 0);
        $dataHutang = array(
            'hutang_dibayar' => $hutangTerbayar + $bayarTunai,
            'hutang_sisa' => $hutangSisa,
            'user_id' => $userID,
            'updated_at' => date('Y-m-d')
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => 0,
            'pengeluaran' => $bayarTunai,
            'grand_total' => $bayarTunai,
            'mode' => 'Bayar Hutang',
            'referensi' => 'BH',
            'source' => '1101',
            'keterangan' => 'Bayar Hutang : ' . $fakturBeli,
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Update Data Hutang
        $this->db->where('faktur_beli', $fakturBeli);
        $this->db->update($this->tableHutang, $dataHutang);
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
