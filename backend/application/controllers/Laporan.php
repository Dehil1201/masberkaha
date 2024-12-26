<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Laporan extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        // if ($this->session->userdata('status') != "MASUK") {
        //     redirect(base_url("otentikasi"));
        // }
        $this->load->model("Laporan_model");
        $this->load->library('form_validation');
        $this->load->model("LogActivity_model");
        $this->load->helper("rupiah_helper");
        $this->load->helper('data_helper');
        $this->load->helper("tgl_indo_helper");
        $this->laporanModel = $this->Laporan_model;
        $this->userID = $this->session->userdata('userID');
    }

    public function laporanNeraca()
    {
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $sumAsetBarang = $this->Laporan_model->sumAsetBarang('data_barang', 'nilai_beli');
        // Pemasukan
        $sumPiutang = $this->Laporan_model->sumDataLaporan('piutang', 'piutang_sisa', $startDate, $endDate, 'updated_at');
        $sumPenjualan = $this->Laporan_model->sumDataLaporan('penjualan', 'pemasukan', $startDate, $endDate, 'date');
        $sumServis = $this->Laporan_model->sumDataLaporan('jasa_servis', 'pemasukan', $startDate, $endDate, 'date');
        // Pengeluaran
        $sumPembelian = $this->Laporan_model->sumDataLaporan('pembelian', 'pengeluaran', $startDate, $endDate, 'date');
        $sumBuyback = $this->Laporan_model->sumDataLaporan('beli_kembali', 'pengeluaran', $startDate, $endDate, 'date');
        $sumHutangBayar = $this->Laporan_model->sumDataLaporan('hutang', 'hutang_dibayar', $startDate, $endDate, 'updated_at');
        $sumHutangSisa = $this->Laporan_model->sumDataLaporan('hutang', 'hutang_sisa', $startDate, $endDate, 'updated_at');
        $totalPemasukan = $sumPenjualan + $sumPiutang;
        $totalPengeluaran = $sumPembelian + $sumBuyback + $sumHutangBayar + $sumHutangSisa;
        $data = array(
            "startDate" => mediumdate_indo($startDate),
            "endDate" => mediumdate_indo($endDate),
            "asetBarang" => rupiah($sumAsetBarang),
            "piutang" => rupiah($sumPiutang),
            "penjualan" => rupiah($sumPenjualan),
            "servis" => rupiah($sumServis),
            "pembelian" => rupiah($sumPembelian),
            "buyback" => rupiah($sumBuyback),
            "hutangDibayar" => rupiah($sumHutangBayar),
            "hutangSisa" => rupiah($sumHutangSisa),
            "totalPemasukan" => rupiah($totalPemasukan),
            "totalPengeluaran" => rupiah($totalPengeluaran),
            "laba" => rupiah($totalPemasukan - $totalPengeluaran),
        );
        echo json_encode($data);
    }

    public function laporanAktivaPassiva()
    {
        // Aktiva Lancar
        $aktivaLancar = $this->Laporan_model->getDaftarRekening('AKTIVA LANCAR');
        $aktivaTetap = $this->Laporan_model->getDaftarRekening('AKTIVA TETAP');
        $passiva = $this->Laporan_model->getDaftarRekening('PASSIVA');
        $totalAktiva = $this->Laporan_model->sumWhere('saldo', 'saldo', 'jenis', 'AKTIVA LANCAR', null, null, null) + $this->Laporan_model->sumWhere('saldo', 'saldo', 'jenis', 'AKTIVA TETAP', null, null, null);
        $totalPassiva = $this->Laporan_model->sumWhere('saldo', 'saldo', 'jenis', 'PASSIVA', null, null, null);
        $dataAktivaLancar = array();
        foreach ($aktivaLancar as $field) {
            $dataAktivaLancar[] = array(
                "no_rekening" => $field->no_rekening,
                "nama_jurnal" => $field->an,
                "saldo" => rupiah($field->saldo),
            );
        }
        $dataAktivaTetap = array();
        foreach ($aktivaTetap as $field) {
            $dataAktivaTetap[] = array(
                "no_rekening" => $field->no_rekening,
                "nama_jurnal" => $field->an,
                "saldo" => rupiah($field->saldo),
            );
        }
        $dataPassiva = array();
        foreach ($passiva as $field) {
            $dataPassiva[] = array(
                "no_rekening" => $field->no_rekening,
                "nama_jurnal" => $field->an,
                "saldo" => rupiah($field->saldo),
            );
        }
        $output = array(
            "aktivaLancar" => $dataAktivaLancar,
            "aktivaTetap" => $dataAktivaTetap,
            "passiva" => $dataPassiva,
            "totalAktiva" => rupiah($totalAktiva),
            "totalPassiva" => rupiah($totalPassiva),
            "totalAktivaPassiva" => rupiah($totalAktiva + $totalPassiva),
        );
        echo json_encode($output);
    }

    public function laporanKas()
    {
        error_reporting(0);
        $status = $this->input->post('mode', TRUE, NULL);
        $source = $this->input->post('source', TRUE, '1101');
        $jenis = $this->input->post('jenis', TRUE, NULL);
        if ($status == 1) {
            $col = 'referensi';
            $val = 'PMNO';
        } else if ($status == 2) {
            $col = 'referensi';
            $val = 'PLNO';
        } else {
            $col = 'faktur IS NOT NULL';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $debit = $this->laporanModel->sumData('pemasukan', $col, $val, $startDate, $endDate, $source, $jenis);
        $kredit = $this->laporanModel->sumData('pengeluaran', $col, $val, $startDate, $endDate, $source, $jenis);
        $saldoAkhir = $this->Laporan_model->sumWhere('saldo', 'saldo', 'no_rekening', $source, null, null, null);
        $saldoAwal = $saldoAkhir - ($debit - $kredit);
        $list = $this->laporanModel->get_datatables_filter($col, $val, $startDate, $endDate, $source, $jenis);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = $field->referensi;
            $row[] = rupiah($field->pemasukan);
            $row[] = ($field->pengeluaran != 0 ? "-" . rupiah($field->pengeluaran) : rupiah($field->pengeluaran));
            $row[] = $field->source . " - " . getDataField("saldo", "no_rekening", $field->source, "an");
            $row[] = $field->mode;
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "debit" => $debit,
            "kredit" => $kredit,
            "saldoAwal" => $saldoAwal,
            "saldoAkhir" => $saldoAkhir,
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->laporanModel->count_all(),
            "recordsFiltered" => $this->laporanModel->count_filtered_filter($col, $val, $startDate, $endDate, $source, $jenis),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function laporanJurnalUmum()
    {
        error_reporting(0);
        $status = $this->input->post('mode', TRUE, NULL);
        $source = $this->input->post('source', TRUE, '1101');
        $jenis = $this->input->post('jenis', TRUE, NULL);
        if ($status == 1) {
            $col = 'referensi';
            $val = 'PJ';
        } else if ($status == 2) {
            $col = 'referensi';
            $val = 'BK';
        } else if ($status == 3) {
            $col = 'referensi';
            $val = 'PB';
        } else if ($status == 4) {
            $col = 'referensi';
            $val = 'BH';
        } else if ($status == 5) {
            $col = 'referensi';
            $val = 'BP';
        } else if ($status == 6) {
            $col = 'referensi';
            $val = 'KAS';
        } else {
            $col = 'faktur IS NOT NULL';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');

        $debit = $this->laporanModel->sumData('pemasukan', $col, $val, $startDate, $endDate, $source, $jenis);
        $kredit = $this->laporanModel->sumData('pengeluaran', $col, $val, $startDate, $endDate, $source, $jenis);

        $saldoAkhir = $this->Laporan_model->sumWhere('saldo', 'saldo', 'no_rekening', $source, null, null, null);
        $saldoAwal = (int) $saldoAkhir - ($debit - $kredit);
        $list = $this->laporanModel->get_datatables_filter($col, $val, $startDate, $endDate, $source, $jenis);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = shortdate_indo($field->date);
            $row[] = $field->faktur;
            $row[] = $field->referensi;
            $row[] = rupiah($field->pemasukan);
            $row[] = ($field->pengeluaran != 0 ? "-" . rupiah($field->pengeluaran) : rupiah($field->pengeluaran));
            $row[] = $field->source . " - " . getDataField("saldo", "no_rekening", $field->source, "an");
            $row[] = $field->mode;
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "debit" => $debit,
            "kredit" => $kredit,
            "saldoAwal" => $saldoAwal,
            "saldoAkhir" => $saldoAkhir,
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->laporanModel->count_all(),
            "recordsFiltered" => $this->laporanModel->count_filtered_filter($col, $val, $startDate, $endDate, $source, $jenis),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getSourceKas()
    {
        $list = $this->laporanModel->getSourceKas();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->source;
            $row[] = getDataField('saldo', 'no_rekening', $field->source, 'an');

            $data[] = $row;
        }

        $output = array(
            "status" => TRUE,
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function laporanBarang()
    {
        error_reporting(0);
        $status = $this->input->post('status', TRUE, NULL);
        if ($status == 1) {
            $valStatus = '0';
        } elseif ($status == 2) {
            $valStatus = '1';
        } elseif ($status == 3) {
            $valStatus = 'J';
        } elseif ($status == 4) {
            $valStatus = 'S';
        } elseif ($status == 5) {
            $valStatus = 'R';
        }
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $list = $this->laporanModel->get_datatables_barang($valStatus, $startDate, $endDate);
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $row = array();
            $row[] = $no++;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = $field->berat;
            $row[] = $field->kadar;
            $row[] = $field->status;
            $row[] = ($field->created_at != null ? shortdate_indo($field->created_at) : '--');
            $row[] = ($field->tanggal_jual != null ? shortdate_indo($field->tanggal_jual) : '--');
            $row[] = ($field->tanggal_terima != null ? shortdate_indo($field->tanggal_terima) : '--');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->laporanModel->count_all(),
            "recordsFiltered" => $this->laporanModel->count_filtered_barang($valStatus, $startDate, $endDate),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function infoTransaksiBarang()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $status = $this->input->post('status', TRUE, NULL);
        if ($status == 1) {
            $valStatus = '0';
        } elseif ($status == 2) {
            $valStatus = '1';
        } elseif ($status == 3) {
            $valStatus = 'J';
        } elseif ($status == 4) {
            $valStatus = 'S';
        } elseif ($status == 5) {
            $valStatus = 'R';
        }
        $output = array(
            "countTotalInstok" => ($status == 1 || $status == null) ? $this->Laporan_model->countWhereBarang('data_barang', 'status', '0', $startDate, $endDate, $valStatus) : 0,
            "totalInstokRp" => ($status == 1 || $status == null) ? rupiah($this->Laporan_model->sumWhere('data_barang', 'harga_jual', 'status', '0', $startDate, $endDate, $valStatus)) : 0,
            "weightInstok" => ($status == 1 || $status == null) ? round($this->Laporan_model->sumWhere('data_barang', 'berat', 'status', '0', $startDate, $endDate, $valStatus), 2) : 0,
            "countSold" => ($status == 3 || $status == null) ? $this->Laporan_model->countWhereBarang('data_barang', 'status', 'J', $startDate, $endDate, $valStatus) : 0,
            "totalSoldRp" => ($status == 3 || $status == null) ? rupiah($this->Laporan_model->sumWhere('data_barang', 'harga_beli', 'status', 'J', $startDate, $endDate, $valStatus)) : 0,
            "weightSold" => ($status == 3 || $status == null) ? round($this->Laporan_model->sumWhere('data_barang', 'berat', 'status', 'J', $startDate, $endDate, $valStatus), 2) : 0,
            "countBuyback" => ($status == 2 || $status == null) ? $this->Laporan_model->countWhereBarang('data_barang', 'status', '1', $startDate, $endDate, $valStatus) : 0,
            "totalBuybackRp" => ($status == 2 || $status == null) ? rupiah($this->Laporan_model->sumWhere('data_barang', 'harga_beli', 'status', '1', $startDate, $endDate, $valStatus)) : 0,
            "weightBuyback" => ($status == 2 || $status == null) ? round($this->Laporan_model->sumWhere('data_barang', 'berat', 'status', '1', $startDate, $endDate, $valStatus), 2) : 0,
            "countServis" => ($status == 4 || $status == null) ? $this->Laporan_model->countWhereBarang('data_barang', 'status', 'S', $startDate, $endDate, $valStatus) : 0,
            "countRusak" => ($status == 5 || $status == null) ? $this->Laporan_model->countWhereBarang('data_barang', 'status', 'R', $startDate, $endDate, $valStatus) : 0,
        );
        echo json_encode($output);
    }

    public function laporaBeliPerbarang()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $user = $this->input->post('user', TRUE, NULL);
        $supplier = $this->input->post('supplier', TRUE, NULL);
        $devisi = $this->input->post('devisi', TRUE, NULL);
        $grandTotal = $this->laporanModel->sumWhereHistory('nilai_beli', 'Pembelian', $startDate, $endDate, $user, $supplier, $devisi);
        $beratTotal = $this->laporanModel->sumWhereHistory('berat', 'Pembelian', $startDate, $endDate, $user, $supplier, $devisi);
        $list = $this->laporanModel->get_datatables_history('Pembelian', $startDate, $endDate, $user, $supplier, $devisi, null);
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $berat = getBarangID($field->kode_barang, 'berat');
            $hargaBeli = getBarangID($field->kode_barang, 'harga_beli');
            $row = array();
            $row[] = $no++;
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = ($berat != null) ? $berat : 0;
            $row[] = rupiah($hargaBeli);
            $row[] = rupiah(getBarangID($field->kode_barang, 'harga_jual'));
            $row[] = rupiah($field->total_beli);
            $row[] = getBarangID($field->kode_barang, 'foto');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "grand_total" => rupiah($grandTotal),
            "berat_total" => round($beratTotal, 2),
            "recordsTotal" => $this->laporanModel->count_all_history(),
            "recordsFiltered" => $this->laporanModel->count_filtered_history('Pembelian', $startDate, $endDate, $user, $supplier, $devisi, null),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function laporaJualPerbarang()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $user = $this->input->post('user', TRUE, NULL);
        $pelanggan = $this->input->post('pelanggan', TRUE, NULL);
        $devisi = $this->input->post('devisi', TRUE, NULL);
        $grandTotal = $this->laporanModel->queryManualPerbarang('Penjualan', 'SUM(DISTINCT harga_jual * berat)', $startDate, $endDate, $user, $pelanggan, $devisi);
        $beratTotal = $this->laporanModel->queryManualPerbarang('Penjualan', 'SUM(DISTINCT berat)', $startDate, $endDate, $user, $pelanggan, $devisi);
        $kodeBarang = $this->laporanModel->queryManualPerbarang('Penjualan', 'barang_history.kode_barang', $startDate, $endDate, $user, $pelanggan, $devisi);
        $list = $this->laporanModel->get_datatables_history('Penjualan', $startDate, $endDate, $user, $pelanggan, $devisi, null);
        $data = array();
        $no = 1;
        foreach ($kodeBarang as $row) {
            $dataOngkostot[] = $this->laporanModel->getPenjualanDetail($row->result)->ongkos;
        }
        foreach ($grandTotal as $row) {
            $dataGrandTot[] = $row->result;
        }
        foreach ($beratTotal as $row) {
            $dataBeraTot[] = $row->result;
        }
        foreach ($list as $field) {
            $ongkos = $this->laporanModel->getPenjualanDetail($field->kode_barang)->ongkos;
            $berat = getBarangID($field->kode_barang, 'berat');
            $hargaJual = getBarangID($field->kode_barang, 'harga_jual');
            $total = $hargaJual * $berat;
            $row = array();
            $row[] = $no++;
            $row[] = $field->kode_barang;
            $row[] = getBarangID($field->kode_barang, 'nama_barang');
            $row[] = getBarangID($field->kode_barang, 'jenis_barang');
            $row[] = ($berat != null) ? $berat : 0;
            $row[] = rupiah(getBarangID($field->kode_barang, 'harga_beli'));
            $row[] = rupiah($hargaJual);
            $row[] = rupiah($total);
            $row[] = rupiah($ongkos);
            $row[] = rupiah($total + $ongkos);
            $row[] = getBarangID($field->kode_barang, 'foto');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "grand_total" => ($dataGrandTot == null) ? 0 : rupiah(array_sum($dataGrandTot)),
            "berat_total" => ($dataBeraTot == null) ? 0 : round(array_sum($dataBeraTot), 2),
            "ongkos_total" => ($dataOngkostot == null) ? 0 : rupiah(array_sum($dataOngkostot)),
            "total_net" => ($dataOngkostot == null || $dataGrandTot == null) ? 0 : rupiah(array_sum($dataGrandTot) + array_sum($dataOngkostot)),
            "recordsTotal" => $this->laporanModel->count_all_history(),
            "recordsFiltered" => $this->laporanModel->count_filtered_history('Penjualan', $startDate, $endDate, $user, $pelanggan, $devisi, null),
            "data" => $data,
        );
        echo json_encode($output);
    }


    public function laporaBuybackPerbarang()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $user = $this->input->post('user', TRUE, NULL);
        $pelanggan = $this->input->post('pelanggan', TRUE, NULL);
        $devisi = $this->input->post('devisi', TRUE, NULL);
        $status = $this->input->post('status', TRUE, NULL);
        $dataGrandTot = $this->laporanModel->sumWhereBuyback('beli_kembali_detail', 'total', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan, $devisi, $status);
        $dataBeraTot = $this->laporanModel->sumWhereBuyback('beli_kembali_detail', 'berat', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan, $devisi, $status);
        $dataPotonganTot = $this->laporanModel->sumWhereBuyback('beli_kembali_detail', 'potongan', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan, $devisi, $status);
        $dataServisTot = $this->laporanModel->sumWhereBuyback('beli_kembali_detail', 'biaya_servis', 'status_proses', 1, $startDate, $endDate, 'date', $user, $pelanggan, $devisi, $status);
        $list = $this->laporanModel->get_datatables_history('Beli Kembali', $startDate, $endDate, $user, $pelanggan, $devisi, $status);
        $data = array();
        $no = 1;
        foreach ($list as $field) {
            $potgram = $this->laporanModel->getBuybackDetail($field->kode_barang)->potgram;
            $potongan = $this->laporanModel->getBuybackDetail($field->kode_barang)->potongan;
            $servis = $this->laporanModel->getBuybackDetail($field->kode_barang)->biaya_servis;
            $berat = getBarangID($field->kode_barang, 'berat');
            $hargaBeli = getBarangID($field->kode_barang, 'harga_beli');
            $hargaJual = getBarangID($field->kode_barang, 'harga_jual');
            $total = $hargaBeli * $berat;
            $row = array();
            $row[] = $no++;
            $row[] = $field->kode_barang;
            $row[] = $field->nama_barang;
            $row[] = $field->jenis_barang;
            $row[] = ($berat != null) ? $berat : 0;
            $row[] = $field->status;
            $row[] = rupiah($hargaBeli);
            $row[] = rupiah($hargaJual);
            $row[] = rupiah($total);
            $row[] = rupiah($potgram) . '=' . rupiah($potongan);
            $row[] = rupiah($servis);
            $row[] = rupiah($total - ($potongan + $servis));
            $row[] = getBarangID($field->kode_barang, 'foto');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "grand_total" => ($dataGrandTot == null) ? 0 : '-' . rupiah($dataGrandTot + $dataPotonganTot + $dataServisTot),
            "berat_total" => ($dataBeraTot == null) ? 0 : round($dataBeraTot, 2),
            "potongan_total" => ($dataPotonganTot == null) ? 0 : rupiah($dataPotonganTot),
            "servis_total" => ($dataServisTot == null) ? 0 : rupiah($dataServisTot),
            "total_net" => ($dataPotonganTot == null || $dataGrandTot == null || $dataServisTot == null) ? 0 : '-' . rupiah($dataGrandTot),
            "recordsTotal" => $this->laporanModel->count_all_history(),
            "recordsFiltered" => $this->laporanModel->count_filtered_history('Beli Kembali', $startDate, $endDate, $user, $pelanggan, $devisi, $status),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->Laporan_model->rules());

        if ($validation->run()) {
            echo json_encode($this->Laporan_model->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $laporan = $this->Laporan_model;
        $validation = $this->form_validation;
        $validation->set_rules($laporan->rules());

        if ($validation->run()) {
            echo json_encode($laporan->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Laporan_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function destroyNota()
    {
        $id = $this->input->post('id');
        $data = $this->Laporan_model->deleteFaktur($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
