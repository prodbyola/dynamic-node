import { 
    DynodeInterface, 
    DynodeOptions, 
    MousePositionType,
    MOUSE_POSITIONS, 
    DynodeDimension,
    DynodePosition,
    DynodeParent,
    // MouseDirectionType,
} from "./interface";

// let xPos = 0, yPos = 0, movement: MouseDirectionType | undefined;

type PropOptions = {
    m1: number;
    n1: number;
    m2: number;
};

/**
 * Finds the value of an unknown number `n2` against known `m2` by using their old values `n1` and `m1`.
 *
 * It aims to solve the equation: while `m1` = 4 and `n1` = 6, if `m2` = 8, what will `n2` be?
 * @param {PropOptions} options
 * @returns
 */
const proportionalScale = (options: PropOptions): number => {
    const n2 = ((options.n1 * options.m2) / options.m1).toFixed();
    return parseInt(n2);
};
  

class DynamicNode implements DynodeInterface {
    element?: HTMLElement | undefined;
    parent?: DynodeParent | undefined;
    position?: DynodePosition | undefined;
    dimension?: DynodeDimension | undefined;

    boundByParent = true;
    
    EDGE = 6;
    mousePosition?: MousePositionType | undefined
    private atCorner = false

    constructor(options: DynodeOptions) {
        let el = options.element
        // const rect = options.rect

        // set element
        if(typeof el === 'string') {
            const getEl = document.getElementById(el)
            if(!getEl) throw new Error(`Element of id ${el} cannot be found in the DOM`)
            else el = getEl
        }

        this.element = el

        // set element's parent before setting element's position
        // because element's position may depend on relative parent's position
        this.setParent()
        const bbp = options.boundByParent
        if(typeof bbp !== 'undefined') this.boundByParent = bbp

        // set rect
        if(options.position) this.setPosition = options.position
        else this.initRect('pos')

        if(options.dimension) this.setDimension = options.dimension
        else this.initRect('dm')

        const EDGE = options.edgeDetectPadding
        if(typeof EDGE !== 'undefined') this.EDGE = EDGE
    }

    isWithinBound(pos: DynodePosition, dm: DynodeDimension){
        const ppos = this.parent?.position as DynodePosition
        const pdm = this.parent?.dimension as DynodeDimension

        // let overflown: boolean | 'left' | 'right' | 'top' | 'bottom' = false
        let withinBound = false

        if(pos && dm && ppos && pdm){
            const t = pos.top, l = pos.left, pt = ppos.top, pl = ppos.left // positions
            const w = dm.width, h = dm.height, pw = pdm.width, ph = pdm.height // dimensions

            const xs = l + w, ys = t + h  // total (x and y) space taken by element
            const pxs = pl + pw, pys = pt + ph  // total (x and y) space taken by element's parent

            withinBound = (l > pl) && (xs < pxs) && (pt < t) && (pys > ys)
        }

        return withinBound
        // return overflown
    }

    /** Sets dynode's parent element */
    private setParent(){
        const parent = this.element?.parentElement
        if(!parent){
            throw new Error('No parent was found for input node. Element must have a relatively positioned parent.')
        }

        const rect = parent.getBoundingClientRect()
        const posType = window.getComputedStyle(parent).position

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
        }
    }

    private validateEl(){
        const el = this.element
        if(!el || typeof el === 'string') {
            throw new Error('The element associated with this Dynode is no longer available in the DOM.')
        }
    }
    
    private set setPosition(pos : DynodePosition) {
        this.validateEl()

        let position = pos
        const parent = this.parent
        const bbp = this.boundByParent
        const ppos = parent?.position as DynodePosition
        
        const withinBound = this.isWithinBound(pos, this.dimension as DynodeDimension)
      
        if(parent?.isRelative){
            position = {
                top: pos.top - ppos.top,
                left: pos.left - ppos.left
            }
        }
        
        if(bbp && !withinBound) return
        const el = this.element
        if(el){
            el.style.top = position.top.toString()+'px'
            el.style.left = position.left.toString()+'px'
        }

        this.position = pos
    }

    private set setDimension(dm : DynodeDimension) {
        this.validateEl()

        const bbp = this.boundByParent
        if(bbp && !this.isWithinBound(this.position as DynodePosition, dm)) return

        const el = this.element

        if(el){
            el.style.width = dm.width.toString()+'px'
            el.style.height = dm.height.toString()+'px'
        }

        this.dimension = dm
    }
    
    private getMouseDistance(e: MouseEvent, init: {x: number, y: number}){
        const mpCurrent = {
            x: e.clientX,
            y: e.clientY
        }

        const dx = mpCurrent.x - init.x, dy = mpCurrent.y - init.y

        return [dx, dy]
    }

    /** Sets Dynode's position or dimension values from input element's `getBoundingClientRect`. */
    private initRect(rt: 'pos' | 'dm'){
        const el = this.element as HTMLElement
        const rect = el?.getBoundingClientRect()

        if(rt === 'pos') {
            const pos = {
                top: rect.top,
                left: rect.left
            }

            this.position = pos 
            this.setPosition = pos // checks if we're within bound
        } else if (rt === 'dm') {
            const dm = {
                width: rect.width,
                height: rect.width
            }

            this.dimension = dm
            this.setDimension = dm
        }

    }

    private resize(e: MouseEvent){
        const mpInit = {
            x: e.clientX,
            y: e.clientY
        }

        const dm = this.dimension
        const pos = this.position

        if(!dm || !pos) throw new Error('Cannot validate dimensions for this dynode')
        let width = dm.width, height = dm.height, top = pos.top, left = pos.left // new values
        // let updatePos = false

        const mp = this.mousePosition
        if(!mp) return // we cannot resize if mouse is not placed at appropriate positions

        const proportional = this.atCorner && e.shiftKey // needs proportional scaling

        const updateDM = (e: MouseEvent) => {
            e.preventDefault()
            
            const [dx, dy] = this.getMouseDistance(e, mpInit)

            if(['right', 'bottom', 'bottom-right', 'bottom-left', 'top-right'].includes(mp)) {
                if(['right', 'bottom-right', 'top-right'].includes(mp)) width = dm.width + dx
                if(['bottom', 'bottom-right', 'bottom-left'].includes(mp)) height = dm.height + dy
            } 
            
            if(['left', 'top', 'top-right', 'top-left', 'bottom-left'].includes(mp)) {
                if(['left', 'bottom-left', 'top-left'].includes(mp)){
                    width = dm.width - dx
                    left = pos.left + dx
                    // updatePos = true
                }
                
                if(['top', 'top-right', 'top-left'].includes(mp)){
                    height = dm.height - dy
                    top = pos.top + dy
                    // updatePos = true
                }

                const withinBound = this.isWithinBound({ left, top }, this.dimension as DynodeDimension)
                if(this.boundByParent && !withinBound) return

                this.setPosition = { left, top }
            }

            if(proportional){
                width = proportionalScale({
                    m1: dm.height,
                    n1: dm.width,
                    m2: height
                })

                width = parseInt(width.toFixed())
            }

            this.setDimension = { width, height }
        }

        document.addEventListener('mousemove', updateDM)
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updateDM)
        })
    }

    private move(e: MouseEvent){
        const mpInit = {
            x: e.clientX,
            y: e.clientY
        }

        const pos = this.position as DynodePosition
        let newTop = 0, newLeft = 0 

        const updatePos = (e: MouseEvent) => {
            const [dx, dy] = this.getMouseDistance(e, mpInit)

            newLeft = pos.left + dx
            newTop = pos.top + dy

            const newPos = {
                top: newTop,
                left: newLeft
            }

            this.setPosition = newPos
        }

        document.addEventListener('mousemove', updatePos)

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updatePos)
        })
    }

    /** Calls Dynode's `move` or `resize` actions. */
    private drag(e: MouseEvent){
        e.preventDefault()

        if(this.mousePosition){
            this.resize(e)
        } else {
            this.move(e)
        }
    }

    /** Tries to detect mouse's position on the element. 
     * 
     * This helps to show the right cursor type and determine if the action should be `resize` or `move`.  
    */
    private detectMousePosition(e: MouseEvent){
        // const rect = this.rect as DynodeRectType
        let {top, left } = { ...this.position as DynodePosition }
        const { width, height } = { ...this.dimension as DynodeDimension }

        // mouse position
        const xPos = e.clientX
        const yPos = e.clientY

        const EDGE = this.EDGE

        const atLeft = xPos >= left && (xPos < (left + EDGE));
        const atRight = xPos >= left + (width - EDGE) && (xPos < (left + width));
        const atTop = yPos >= top && (yPos < (top + EDGE));
        const atBottom = yPos >= top + (height - EDGE) && (yPos < (top + height));

        // corners
        const tl = atTop && atLeft, tr = atTop && atRight, bl = atBottom && atLeft, br = atBottom && atRight
        this.atCorner = tl || tr || bl || br

        let mp: MousePositionType | undefined
        if(this.atCorner) {
            if (tl) mp = 'top-left'
            else if (tr) mp = 'top-right'
            else if (bl) mp = 'bottom-left'
            else if (br) mp = 'bottom-right'
        } else {
            if (atLeft) mp = 'left'
            else if (atRight) mp ='right'
            else if (atTop) mp = 'top'
            else if (atBottom) mp = 'bottom'
        }

        const classList = this.element?.classList
        if(!mp || mp !== this.mousePosition) {
            MOUSE_POSITIONS.forEach(mp => {
                if(classList?.contains(mp)) classList?.remove(mp)
            })
        }

        this.mousePosition = mp
        
        if(mp) {
            classList?.add(mp)
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

    private addElementListeners(){
        const el = this.element
        el?.addEventListener('mousemove', (e) => {
            this.detectMousePosition(e)
        })

        el?.addEventListener('mousedown', this.drag.bind(this))
    }

    mount(){
        this.addElementListeners()

        const el = this.element
        el?.classList.add('dynode')
    }
}

export default DynamicNode