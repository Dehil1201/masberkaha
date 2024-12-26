<?php defined('BASEPATH') or exit('No direct script access allowed');

class Saldo_model extends CI_Model
{
    var $table = 'saldo';
    var $table_detail = 'faktur';
    var $column_order = array('id', 'no_rekening', 'an', '', '', '', 'saldo',  'jenis');
    var $column_search = array('id', 'no_rekening', 'an', 'saldo');
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
                'field' => 'no_rekening',
                'label' => 'Nama Rekening',
                'rules' => 'required'
            ]
        ];
    }

    private function _get_datatables_query()
    {
        $this->db->from($this->table);
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

    public function count_all()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    private function _get_datatables_detail_query($noRekening)
    {
        $this->db->from($this->table_detail);
        $this->db->where('source', $noRekening);
        $this->db->where('faktur !=', '-');
        $this->db->where('date', date('Y-m-d'));
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

    function get_datatables_detail($noRekening)
    {
        $this->_get_datatables_detail_query($noRekening);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_detail($noRekening)
    {
        $this->_get_datatables_detail_query($noRekening);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_detail()
    {
        $this->db->from($this->table_detail);
        return $this->db->count_all_results();
    }

    public function add()
    {
        $post = $this->input->post();
        $data = array( //id', 'no_rekening', 'an', 'saldo'
            'no_rekening' => htmlspecialchars($post["no_rekening"], ENT_QUOTES),
            'an' => htmlspecialchars($post["an"], ENT_QUOTES),
            'saldo' => 0,
            'jenis' => htmlspecialchars($post["jenis"], ENT_QUOTES),

        );
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $post = $this->input->post();
        $no_rekening = htmlspecialchars($post["no_rekening"], ENT_QUOTES);
        $an =  htmlspecialchars($post["an"], ENT_QUOTES);
        $jenis =  htmlspecialchars($post["jenis"], ENT_QUOTES);
        $id_saldo = htmlspecialchars($post["saldo_id"], ENT_QUOTES);
        $this->db->query("UPDATE saldo SET no_rekening = '$no_rekening' , an = '$an', jenis = '$jenis' where id = '$id_saldo'");

        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function debit()
    {
        $post = $this->input->post();
        $debit = $post["jumlah_saldo"];
        $no_rekening = $post["no_rekening"];
        $this->db->query("UPDATE saldo SET saldo = saldo + $debit where no_rekening = '$no_rekening'");
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function kredit()
    {
        $post = $this->input->post();
        // $saldo_now = $saldo;
        $kredit = $post["jumlah_saldo"];
        $no_rekening = $post["no_rekening"];
        $this->db->query("UPDATE saldo SET saldo = saldo - $kredit where no_rekening = '$no_rekening'");
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function get_saldo_by_rekening()
    {
        $post = $this->input->post();
        $no_rekening = $post["no_rekening"];
        $data = $this->db->query(" SELECT * FROM saldo WHERE no_rekening = '$no_rekening'")->row();
        return $data;
    }

    public function get_all_data()
    {
        $data = $this->db->query(" SELECT * from saldo ")->result();
        return $data;
    }

    public function delete($id)
    {
        return $this->db->delete($this->table, array("id" => $id));
    }

    public function sumToday($table, $colSum, $col, $id)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        $this->db->where('date', date('Y-m-d'));
        return $this->db->get($table)->row()->$colSum;
    }

    public function sumYesterday($table, $colSum, $col, $id)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        $this->db->where('date', date('Y-m-d', strtotime(date('Y-m-d') . ' -1 day')));
        return $this->db->get($table)->row()->$colSum;
    }

    public function sumWhere($table, $colSum, $col, $val)
    {
        $this->db->select_sum($colSum);
        if ($val != NULL) {
            $this->db->where($col, $val);
        }
        return $this->db->get($table)->row()->$colSum;
    }
}
