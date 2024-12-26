class NotificationModal{
	static show(msg, status) {
        swal.fire({
            title: `${status}`,
            text: `${msg}`,
            icon: `${status}`,
            confirmButtonColor: '#4fa7f3'
        });
	}

}

export default NotificationModal;