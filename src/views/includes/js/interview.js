const interview = {
    getContainer: () => {
        return document.getElementById('interview-container')
    },
    addElement: (type) => {
        console.log(`Add element: `, type)
        const elem = document.createElement('div');
        elem.classList.add('elem', type);
        interview.getContainer().appendChild(elem);
        //  TODO: broadcast update
    },



}