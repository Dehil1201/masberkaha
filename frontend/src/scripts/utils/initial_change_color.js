
const ChangeColor = {

	async initColor(classColor) {
		document.getElementById('accordionSidebar').classList.add(`${classColor}`);
	},

    async removeColor(classColor) {
        document.getElementById('accordionSidebar').classList.remove(`${classColor}`);
    }

    
}

export default ChangeColor;
