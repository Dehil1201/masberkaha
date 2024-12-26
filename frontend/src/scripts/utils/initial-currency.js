class FormatCurrency {
    static async getValue(elmID) {
        const result = elmID.replace(/[^,\d]/g, '').toString();
        return result;
    }

    static async setValue(value) {
        const result = ((value < 0) ? '-Rp. ' : 'Rp. ') + await this._formatRupiah(value);
        return result;
    }

    static async _formatRupiah(value) {
        let reverse = value.toString().split('').reverse().join(''),
            format = reverse.match(/\d{1,3}/g);
        format = format.join('.').split('').reverse().join('');
        return format;
    }

    static async initialCurrency({ elmId }) {
        $(`#${elmId}`).maskMoney({
            prefix: 'Rp. ',
            thousands: '.',
            decimal: ',',
            precision: 0
        });
    }
}

export default FormatCurrency;
