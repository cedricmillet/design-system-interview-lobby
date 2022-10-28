
const getContainer = () => document.getElementById('interview-container')
const OBJECT_CLASSNAME = 'obj';

const diagram = {
    clear: function() {
        getContainer().innerHTML = "";  // Bruteforce but perfect
        Lobby.sendDiagramUpdate()
    },
    //  Adds element: square
    addSquare: function() {
        this.addElement('square')
    },
    //  Adds element: image
    addImage: function(url) {
        this.addElement('image', {backgroundImage: `url(${url})`})
    },
    //  Adds an element to diagram
    addElement: function (type, options = null) {
        const elem = createDiagramElement(type);
        if(options !== null)
            updateDiagramElement(elem, options)
        getContainer().appendChild(elem);
        Lobby.sendDiagramUpdate()
    },
    //  Convert DOM elements into JSON object
    toJSON: () => Array.from(getContainer().children).map(elem => {
        return {
            //  Fixed properties
            uuid: elem.getAttribute('data-uuid'),
            type: elem.getAttribute('data-type'),
            //  Customizable properties
            pos: [elem.style.left, elem.style.top],
            backgroundImage: elem.style.backgroundImage,
        }
    }),
    //  Update DOM elements from JSON object
    updateFromJSON: (jsonElements) => {
        if(!Array.isArray(jsonElements)) throw new Error(`jsonElements must be an Array`)
        const parent = getContainer();

        //  Create / Update
        for(const jsonElement of jsonElements) {
            const domElement = parent.querySelector(`.obj[data-uuid="${jsonElement.uuid}"]`)
            if(domElement) {        //  Update
                updateDiagramElement(domElement, jsonElement);
            } else {                //  Create
                const newElement = createDiagramElement(jsonElement);
                getContainer().appendChild(newElement);
            }
        }

        //  Delete
        Array.from(parent.children).forEach(child => {
            const uuid = child.getAttribute('data-uuid');
            if(jsonElements.find(elem => elem.uuid === uuid)) return;
            parent.removeChild(child);
        });
    },

}

const updateDiagramElement = (domElement, json) => {

    if(typeof json !== 'object') {
        console.warn(`cannot update diagram element without json obj`);
        return;
    }

    const updateIfNecessary = (selector, expectedValue, obj=null) => {
        if(!expectedValue) return;
        if(obj === null) obj=domElement
        let idx = selector.indexOf('.')
        if(idx > -1) {
            return updateIfNecessary(selector.substr(idx + 1), expectedValue, obj[selector.substring(0, idx)]);
        }

        if(obj[selector] !== expectedValue)
            obj[selector] = expectedValue;
    }

    if(json.hasOwnProperty('pos')) {
        updateIfNecessary('style.left', json.pos[0])
        updateIfNecessary('style.top', json.pos[1])
    }

    if(json.hasOwnProperty('backgroundImage'))
        updateIfNecessary('style.backgroundImage', json.backgroundImage)

    //updateIfNecessary('style.background', 'blue')
}

const createDiagramElement = (typeOrJSONData) => {
    console.log(`Create diagram element: `, typeOrJSONData)
    const elem = document.createElement('div');

    if(typeof typeOrJSONData === 'object') {    // Create by JSON
        if(!typeOrJSONData.uuid || !typeOrJSONData.type) {
            throw new Error(`Unable to create object from incomplete json (missing uuid or type): ${typeOrJSONData}`);
        }
        elem.setAttribute('data-uuid', typeOrJSONData.uuid)
        elem.setAttribute('data-type', typeOrJSONData.type)
        updateDiagramElement(elem, typeOrJSONData)
    } else {                                    //  Create object by type (no json provided)
        elem.setAttribute('data-uuid', uuid())
        elem.setAttribute('data-type', typeOrJSONData)
    }

    //  Adds object class
    elem.classList.add(OBJECT_CLASSNAME);
    
    //  Adds draggable events
    elem.onmousedown = function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {  // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            Lobby.sendDiagramUpdate()
        };
        // call a function whenever the cursor moves:
        document.onmousemove = function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elem.style.top = (elem.offsetTop - pos2) + "px";
            elem.style.left = (elem.offsetLeft - pos1) + "px";
            // Lobby.sendDiagramUpdate() // TODO: delete me !
        }
    }

    return elem;
}


//  Select / unselect diagram objects
const container = getContainer();
container.addEventListener('mousedown', (event) => {
    const selectedClass = `selected`;
    const obj = event.target;

    //  Usefull methods to select DOM obj
    const select = (domObj) => domObj.classList.add(selectedClass);
    const isSelected = (domObj) => domObj.classList.contains(selectedClass);
    const unselect = () => container.querySelectorAll(`.${selectedClass}`).forEach(elem => {
        elem.classList.remove(selectedClass);
    });

    //  Select / unselect logic
    if(event.target === container) {
        unselect();
    } else if(obj.classList.contains(OBJECT_CLASSNAME) && !isSelected(obj)) {
        unselect();
        select(obj);
    }

    document.getElementById('selectedObject').innerHTML = obj.classList.toString()
})