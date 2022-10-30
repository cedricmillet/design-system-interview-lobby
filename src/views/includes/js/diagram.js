
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
    //  Adds element: line
    addLine: function() {
        this.addElement('line', {width: '50px'});
    },
    //  Adds an element to diagram
    addElement: function (type, options=null) {
        const elem = createDiagramElement(type);
        if(options !== null)
            updateDiagramElement(elem, options)
        Lobby.sendDiagramUpdate()
    },
    //  Convert DOM elements into JSON object
    toJSON: () => Array.from(getContainer().children)
                    .filter(elem => elem.getAttribute('data-type') !== 'helper')
                    .map(elem => {
                        return {
                            //  Fixed properties
                            uuid: elem.getAttribute('data-uuid'),
                            type: elem.getAttribute('data-type'),
                            //  Customizable properties
                            pos: [elem.style.left, elem.style.top],
                            backgroundImage: elem.style.backgroundImage,
                            width: elem.style.width,
                            transform: elem.style.transform
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
                createDiagramElement(jsonElement);
            }
        }

        //  Delete
        Array.from(parent.children).forEach(child => {
            const uuid = child.getAttribute('data-uuid');
            const type = child.getAttribute('data-type');
            if(jsonElements.find(elem => elem.uuid === uuid)) return;
            if(type === 'helper') return;
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
    
    if(json.hasOwnProperty('width')) {
        updateIfNecessary('style.width', json.width)
    }

    if(json.hasOwnProperty('transform')) {
        updateIfNecessary('style.transform', json.transform)
    }

    //updateIfNecessary('style.background', 'blue')
}

/**
 * Create object and append it to diagram container
 * @param {string|object} typeOrJSONData 
 * @returns 
 */
const createDiagramElement = (typeOrJSONData, classes=[OBJECT_CLASSNAME]) => {
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

    //  Adds object required classes
    classes.forEach(_class => elem.classList.add(_class));
    elem.classList.add('draggable');

    //  Adds into container
    getContainer().appendChild(elem);

    return elem;
}

const createHelper = () => createDiagramElement('helper')



//  Select / unselect diagram objects
const container = getContainer();
container.addEventListener('mousedown', (event) => {
    const selectedClass = `selected`;
    const obj = event.target;

    //  Do not change selected object when user click on helper
    if(obj.getAttribute('data-type') === 'helper') {
        return;
    }

    //  Usefull methods to select DOM obj
    const select = (domObj) => {
        domObj.classList.add(selectedClass);
        toggleElementHelpers(domObj, true)
    }
    const isSelected = (domObj) => domObj.classList.contains(selectedClass);
    const unselect = () => container.querySelectorAll(`.${selectedClass}`).forEach(elem => {
        if(!elem.classList.contains(selectedClass)) return;
        elem.classList.remove(selectedClass);
        toggleElementHelpers(elem, false)
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

//  Draggable objects
container.addEventListener('mousedown', (e) => {
    const elem = e.target;
    if(!elem || !elem.classList.contains('draggable')) return;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = () => {  // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        if(elem.getAttribute('data-type') === 'helper')
            elem.update();
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

        if(elem.update) {
            elem.update();
        }
    }
});

const toggleElementHelpers = (domElement, enable) => {
    if(!enable) {   //  Remove all helpers from container
        domElement.update = null;
        Array.from(container.querySelectorAll(`[data-type="helper"]`)).forEach(helper => {
            container.removeChild(helper);
        });
        return
    }
    //  Create helpers of provided DOM element
    switch (domElement.getAttribute('data-type')) {
        case 'line':
            addsLineHelpers(domElement);
            break;
    }
}

//  Create helpers, place them and attach mouse events
const addsLineHelpers = (domElement) => {
    const p1 = createHelper();
    const p2 = createHelper();
    
    //  Update helper points position when line is selected or moved
    domElement.update = () => {
        const [xMid, yMid] = [domElement.offsetLeft, domElement.offsetTop];
        //  Retrieve rotation angle in degrees
        let angle;
        try {
            angle = +((new RegExp(/rotate\((.*)deg\)/gi)).exec(domElement.style.transform)[1])
        } catch (error) { angle = 0; }
        const angleInRadian = angle * Math.PI / 180;
        const dist = +(domElement.style.width.replace('px', ''));
        p1.style.left = dist/2 * Math.cos(angleInRadian) + xMid - p1.offsetWidth/2;
        p1.style.top = dist/2 * Math.sin(angleInRadian) + yMid - p1.offsetHeight/2;
        p2.style.left = -dist/2 * Math.cos(angleInRadian) + xMid - p2.offsetWidth/2;
        p2.style.top = -dist/2 * Math.sin(angleInRadian) + yMid - p2.offsetHeight/2;
    }

    //  Update line when helper object is moved
    p1.update = p2.update = () => {
        const [xa, ya] = [p1.offsetLeft+p1.offsetWidth/2, p1.offsetTop+p1.offsetHeight/2];
        const [xb, yb] = [p2.offsetLeft+p2.offsetWidth/2, p2.offsetTop+p2.offsetHeight/2];
        //  Update line position
        const [xMid, yMid] = [(xa+xb)/2, (ya+yb)/2];
        domElement.style.left = xMid;
        domElement.style.top = yMid;
        //  Update line angle
        const angleInRadian = Math.atan2(ya-yb, xa-xb);
        const angleInDegrees = (angleInRadian * 180) / Math.PI;
        domElement.style.transform = `translate(-50%, -50%) rotate(${angleInDegrees}deg)`;
        //  Update line length
        const dist = Math.sqrt((xb-xa)**2 + (yb-ya)**2);
        domElement.style.width = `${dist}px`;
    }
    

    domElement.update();
}