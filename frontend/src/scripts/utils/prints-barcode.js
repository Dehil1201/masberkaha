const FormatBarcode =  {
    
    async makeStore(){
        this._data = [];
    },

    async pushData({kode_barang , berat, kadar, harga_jual}){
        let gold = {
            "kode_barang": `${kode_barang}`,
            "berat": `${berat}`,
            "kadar": `${kadar}`,
            "harga_jual": `${harga_jual}`
           }
        this._data.push(gold);
    },

    isReady(kode){
        const result = this._data.map((e) => { return e.kode_barang; }).indexOf(`${kode}`);
        let value = false
        if (result != -1) {
            value = true
        }
        return value;
    },

    async deleteData(kode){
        let removeIndex = this._data.map((item)=> { return item.kode_barang; }).indexOf(`${kode}`);
        this._data.splice(removeIndex, 1)
    },

    async getData(){
        return this._data;
    },

    async size(){
        return this._data.length
     },


}


export default FormatBarcode;
