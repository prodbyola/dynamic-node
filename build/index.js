"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
/**
 * Finds the value of an unknown number `n2` against known `m2` by using their old values `n1` and `m1`.
 *
 * It aims to solve the equation: while `m1` = 4 and `n1` = 6, if `m2` = 8, what will `n2` be?
 * @param {PropOptions} options
 * @returns
 */
const proportionalScale = (options) => {
    const n2 = ((options.n1 * options.m2) / options.m1).toFixed();
    return parseInt(n2);
};
class Dynode {
    constructor(options) {
        this.boundByParent = true;
        this.EDGE = 6;
        this.atCorner = false;
        let el = options.element;
        // const rect = options.rect
        // set element
        if (typeof el === 'string') {
            const getEl = document.getElementById(el);
            if (!getEl)
                throw new Error(`Element of id ${el} cannot be found in the DOM`);
            else
                el = getEl;
        }
        this.element = el;
        // set element's parent before setting element's position
        // because element's position may depend on relative parent's position
        this.setParent();
        const bbp = options.boundByParent;
        if (typeof bbp !== 'undefined')
            this.boundByParent = bbp;
        // set rect
        if (options.position)
            this.setPosition = options.position;
        else
            this.setRect('pos');
        if (options.dimension)
            this.setDimension = options.dimension;
        else
            this.setRect('dm');
        const EDGE = options.edgeDetectPadding;
        if (typeof EDGE !== 'undefined')
            this.EDGE = EDGE;
    }
    get getOverflow() {
        var _a, _b;
        const pos = this.position;
        const dm = this.dimension;
        const ppos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.position;
        const pdm = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.dimension;
        let overflown = false;
        if (pos && dm && ppos && pdm) {
            const t = pos.top, l = pos.left, pt = ppos.top, pl = ppos.left; // positions
            const w = dm.width, h = dm.height, pw = pdm.width, ph = pdm.height; // dimensions
            const xs = l + w, ys = t + h; // total (x and y) space taken by element
            const pxs = pl + pw, pys = pt + ph; // total (x and y) space taken by element
            // check overflow
            if (l < pl)
                overflown = 'left';
            if (xs > pxs)
                overflown = 'right';
            if (t < pt)
                overflown = 'top';
            if (ys > pys)
                overflown = 'bottom';
        }
        return overflown;
    }
    /** Sets dynode's parent element */
    setParent() {
        var _a;
        const parent = (_a = this.element) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (!parent) {
            throw new Error('No parent was found for input node. Element must have a relatively positioned parent.');
        }
        const rect = parent.getBoundingClientRect();
        const posType = window.getComputedStyle(parent).position;
        this.parent = {
            element: parent,
            position: {
                top: rect.top,
                left: rect.left
            },
            dimension: {
                width: rect.width,
                height: rect.height
            },
            isRelative: posType === 'relative'
        };
    }
    validateEl() {
        const el = this.element;
        if (!el || typeof el === 'string') {
            throw new Error('The element associated with this Dynode is no longer available in the DOM.');
        }
    }
    set setPosition(pos) {
        this.validateEl();
        let position = pos;
        const parent = this.parent;
        const bbp = this.boundByParent;
        const ppos = parent === null || parent === void 0 ? void 0 : parent.position;
        const overflow = this.getOverflow;
        if (bbp && overflow) {
            const dm = this.dimension;
            const pdm = parent === null || parent === void 0 ? void 0 : parent.dimension;
            if (overflow === 'left') {
                pos.left = ppos.left;
            }
            else if (overflow === 'right') {
                pos.left = pdm.width - dm.width;
            }
            // document.removeEventListener
        }
        if (parent === null || parent === void 0 ? void 0 : parent.isRelative) {
            position = {
                top: pos.top - ppos.top,
                left: pos.left - ppos.left
            };
        }
        const el = this.element;
        if (el) {
            el.style.top = position.top.toString() + 'px';
            el.style.left = position.left.toString() + 'px';
        }
        this.position = pos;
    }
    set setDimension(dm) {
        this.validateEl();
        const bbp = this.boundByParent;
        if (bbp && this.getOverflow)
            return;
        const el = this.element;
        if (el) {
            el.style.width = dm.width.toString() + 'px';
            el.style.height = dm.height.toString() + 'px';
        }
        this.dimension = dm;
    }
    getMouseDistance(e, init) {
        const mpCurrent = {
            x: e.clientX,
            y: e.clientY
        };
        const dx = mpCurrent.x - init.x, dy = mpCurrent.y - init.y;
        return [dx, dy];
    }
    /** Sets Dynode's position or dimension values from input element's `getBoundingClientRect`. */
    setRect(rt) {
        const el = this.element;
        const rect = el === null || el === void 0 ? void 0 : el.getBoundingClientRect();
        if (rt === 'pos') {
            this.setPosition = {
                top: rect.top,
                left: rect.left
            };
        }
        else if (rt === 'dm') {
            this.setDimension = {
                width: rect.width,
                height: rect.width
            };
        }
    }
    resize(e) {
        const mpInit = {
            x: e.clientX,
            y: e.clientY
        };
        const dm = this.dimension;
        const pos = this.position;
        if (!dm || !pos)
            throw new Error('Cannot validate dimensions for this dynode');
        let width = dm.width, height = dm.height, top = pos.top, left = pos.left; // new values
        const mp = this.mousePosition;
        if (!mp)
            return; // we cannot resize if mouse is not placed at appropriate positions
        const proportional = this.atCorner && e.shiftKey; // needs proportional scaling
        const updateDM = (e) => {
            e.preventDefault();
            const [dx, dy] = this.getMouseDistance(e, mpInit);
            if (['right', 'bottom', 'bottom-right', 'bottom-left', 'top-right'].includes(mp)) {
                if (['right', 'bottom-right', 'top-right'].includes(mp))
                    width = dm.width + dx;
                if (['bottom', 'bottom-right', 'bottom-left'].includes(mp))
                    height = dm.height + dy;
            }
            if (['left', 'top', 'top-right', 'top-left', 'bottom-left'].includes(mp)) {
                if (['left', 'bottom-left', 'top-left'].includes(mp)) {
                    width = dm.width - dx;
                    left = pos.left + dx;
                }
                if (['top', 'top-right', 'top-left'].includes(mp)) {
                    height = dm.height - dy;
                    top = pos.top + dy;
                }
                // don't update horizontally dragged positions when you need proportional scaling
                // const mm = this.detectMouseMovement(e) as string
                // console.log('mm ', mm)
                // if(proportional && ['left', 'right'].includes(mm)) return
                // else 
                this.setPosition = { left, top };
            }
            if (proportional) {
                width = proportionalScale({
                    m1: dm.height,
                    n1: dm.width,
                    m2: height
                });
                width = parseInt(width.toFixed());
            }
            this.setDimension = { width, height };
        };
        document.addEventListener('mousemove', updateDM);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updateDM);
        });
    }
    move(e) {
        const mpInit = {
            x: e.clientX,
            y: e.clientY
        };
        const pos = this.position;
        let newTop = 0, newLeft = 0;
        const updatePos = (e) => {
            const [dx, dy] = this.getMouseDistance(e, mpInit);
            newLeft = pos.left + dx;
            newTop = pos.top + dy;
            const newPos = {
                top: newTop,
                left: newLeft
            };
            this.setPosition = newPos;
        };
        document.addEventListener('mousemove', updatePos);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updatePos);
        });
    }
    /** Calls Dynode's `move` or `resize` actions. */
    drag(e) {
        if (this.mousePosition) {
            this.resize(e);
        }
        else {
            this.move(e);
        }
    }
    /** Tries to detect mouse's position on the element.
     *
     * This helps to show the right cursor type and determine if the action should be `resize` or `move`.
    */
    detectMousePosition(e) {
        var _a;
        // const rect = this.rect as DynodeRectType
        let { top, left } = Object.assign({}, this.position);
        const { width, height } = Object.assign({}, this.dimension);
        // mouse position
        const xPos = e.clientX;
        const yPos = e.clientY;
        const EDGE = this.EDGE;
        const atLeft = xPos >= left && (xPos < (left + EDGE));
        const atRight = xPos >= left + (width - EDGE) && (xPos < (left + width));
        const atTop = yPos >= top && (yPos < (top + EDGE));
        const atBottom = yPos >= top + (height - EDGE) && (yPos < (top + height));
        // corners
        const tl = atTop && atLeft, tr = atTop && atRight, bl = atBottom && atLeft, br = atBottom && atRight;
        this.atCorner = tl || tr || bl || br;
        let mp;
        if (this.atCorner) {
            if (tl)
                mp = 'top-left';
            else if (tr)
                mp = 'top-right';
            else if (bl)
                mp = 'bottom-left';
            else if (br)
                mp = 'bottom-right';
        }
        else {
            if (atLeft)
                mp = 'left';
            else if (atRight)
                mp = 'right';
            else if (atTop)
                mp = 'top';
            else if (atBottom)
                mp = 'bottom';
        }
        const classList = (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList;
        if (!mp || mp !== this.mousePosition) {
            interface_1.MOUSE_POSITIONS.forEach(mp => {
                if (classList === null || classList === void 0 ? void 0 : classList.contains(mp))
                    classList === null || classList === void 0 ? void 0 : classList.remove(mp);
            });
        }
        this.mousePosition = mp;
        if (mp) {
            classList === null || classList === void 0 ? void 0 : classList.add(mp);
        }
    }
    // private detectMouseMovement(e: MouseEvent){
    //     const draggedLeft = e.pageX < xPos;
    //     const draggedRight = e.pageX > xPos;
    //     const draggedUp = e.pageY < yPos;
    //     const draggedDown = e.pageY > yPos;
    //     if (draggedLeft) movement = 'left';
    //     if (draggedRight) movement = 'right';
    //     if (draggedUp) movement = 'up';
    //     if (draggedDown) movement = 'down';
    //     xPos = e.pageX 
    //     yPos = e.pageY;
    //     return movement;
    // }
    addElementListeners() {
        const el = this.element;
        el === null || el === void 0 ? void 0 : el.addEventListener('mousemove', (e) => {
            this.detectMousePosition(e);
        });
        el === null || el === void 0 ? void 0 : el.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.drag(e);
        });
    }
    mount() {
        // console.log('parent ', this.parent)
        // console.log('rect ', this.rect)
        this.addElementListeners();
        const el = this.element;
        el === null || el === void 0 ? void 0 : el.classList.add('dynode');
    }
}
exports.default = Dynode;
