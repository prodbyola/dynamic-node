import { 
    DynodeInterface, 
    DynodeOptions, 
    MousePositionType,
    MOUSE_POSITIONS, 
    DynodeDimension,
    DynodePosition,
    DynodeParent,
    EventKey,
    EventValue
} from "./interface";

import { proportionalScale,getMouseDistance } from "./utils"

export * from './interface'

type DirectionType = 'left' | 'right' | 'top' | 'bottom'

class DynamicNode implements DynodeInterface {
    element?: HTMLElement | undefined;
    parent?: DynodeParent | undefined;

    private events: Map<EventKey, Array<(e?: EventValue) => void>> = new Map
    private options: DynodeOptions | undefined
    private _position: DynodePosition = { top: 0, left: 0 };
    private _dimension: DynodeDimension = { width: 0, height: 0 };
    
    private _boundByParent = true;
    relativePosition: DynodePosition = { left: 0, top: 0 } 
    private mounted = false
    
    EDGE = 6;
    mousePosition?: MousePositionType | undefined
    private atCorner = false
    private boundedSides: Map<DirectionType, boolean> | undefined

    constructor(options: DynodeOptions) {
        this.options = options
    }

    get boundByParent(){
        return this._boundByParent
    }

    set boundByParent(value: boolean){
        const bs = this.boundedSides
        const parent = this.parent
        
        if(value && bs && parent){
            const dm = this.dimension as DynodeDimension
            const pos = this.position as DynodePosition
            
            const pdm = parent.dimension as DynodeDimension
            const ppos = parent.position as DynodePosition

            
            const sides = bs.keys()
            for(const key in sides){
                const side = key as DirectionType
                const sideIsBound = bs.get(side)
                const PAD = 2
                
                if(!sideIsBound) {
                    if(['left', 'right'].includes(side)){
                        if(side === 'left' || side === 'right') {
                            pos.left = ppos.left - PAD
                            this.position = pos
                        }
                        
                        if(side === 'right') {
                            // left should already be fixed so we check if is width is overflown
                            // if overflown, we fix the left
                            const withinBound = this.isWithinBound(pos, dm)
                            if(!withinBound) {
                                dm.width = pdm.width - PAD
                            }
                        }
                    } else {
                        if(side === 'top'  || side === 'bottom'){
                            pos.top = ppos.top - PAD
                            this.position = pos
                        }

                        if(side === 'bottom') {
                            // left should already be fixed so we check if is width is overflown
                            // if overflown, we fix the left
                            const withinBound = this.isWithinBound(pos, dm)
                            if(!withinBound) {
                                dm.height = pdm.height - PAD
                            }
                        }
                    }
                }
            }
        }

        this._boundByParent = value
    }

    /**
     * Checks whether given position/dimension is within the parent's boundaries.
     * @param { DynodePosition } pos - position.
     * @param { DynodeDimension } dm - dimension. 
     * @returns boolean 
     */
    isWithinBound(pos: DynodePosition, dm: DynodeDimension){
        const ppos = this.parent?.position as DynodePosition
        const pdm = this.parent?.dimension as DynodeDimension

        let withinBound = false

        if(pos && dm && ppos && pdm){
            const t = pos.top, l = pos.left, pt = ppos.top, pl = ppos.left // node and parent's positions
            const w = dm.width, h = dm.height, pw = pdm.width, ph = pdm.height // node and parent's dimensions

            const xs = l + w, ys = t + h  // total (x and y) space taken by node
            const pxs = pl + pw, pys = pt + ph  // total (x and y) space taken by parent
            

            // check boundaries
            const left = l >= pl, right = xs < pxs, top = pt <= t, bottom = pys > ys
            withinBound = (left) && (right) && (top) && (bottom)

            const bm = new Map<DirectionType, boolean>() // boundary mapping
            bm.set('left', left)
            bm.set('right', right)
            bm.set('top', top)
            bm.set('bottom', bottom)

            this.boundedSides = bm
            
        }

        return withinBound
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

    /** Validates input element */
    private validateEl(){
        const el = this.element
        if(!el || typeof el === 'string') {
            throw new Error('The element associated with this Dynode is no longer available in the DOM.')
        }
    }

    get position(){
        return this._position
    }
    
    set position(pos : DynodePosition) {
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
        
        this.relativePosition = position
        this._position = pos
    }

    get dimension(){
        return this._dimension
    }

    set dimension(dm : DynodeDimension) {
        this.validateEl()

        const bbp = this.boundByParent
        if(bbp && !this.isWithinBound(this.position as DynodePosition, dm)) return

        const el = this.element

        if(el){
            el.style.width = dm.width.toString()+'px'
            el.style.height = dm.height.toString()+'px'
        }

        this._dimension = dm
    }

    /** 
     * Sets Dynode's position or dimension values from input element's `getBoundingClientRect`. 
     * @param {string} rt - Whether to initialize position or dimension. Possible values are `pos` and `dm`.
    */
    private initRect(rt: 'pos' | 'dm'){
        const el = this.element as HTMLElement
        const rect = el?.getBoundingClientRect()

        if(rt === 'pos') {
            const pos = {
                top: rect.top,
                left: rect.left
            }

            this.position = pos 
        } else if (rt === 'dm') {
            const dm = {
                width: rect.width,
                height: rect.width
            }

            this.dimension = dm
        }

    }

    /**
     * Resizes the DynamicNode
     * @param e 
     * @returns 
     */
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
            
            const [dx, dy] = getMouseDistance(e, mpInit)

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

                this.position = { left, top }
            }

            if(proportional){
                width = proportionalScale({
                    m1: dm.height,
                    n1: dm.width,
                    m2: height
                })

                width = parseInt(width.toFixed())
            }

            this.dimension = { width, height }

            const events = this.events.get('resize')
            if(events && events.length){
                events.forEach(func => func({
                    pos: this.position,
                    dm: this.dimension,
                    rPos: this.relativePosition
                }))
            }
        }

        document.addEventListener('mousemove', updateDM)
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', updateDM)
        })
    }

    /**
     * Moves the DynamicNode.
     * @param { MouseEvent } e - Mouse event 
    */
    private move(e: MouseEvent){
        const mpInit = {
            x: e.clientX,
            y: e.clientY
        }

        const pos = this.position as DynodePosition
        let newTop = 0, newLeft = 0 

        const updatePos = (e: MouseEvent) => {
            const [dx, dy] = getMouseDistance(e, mpInit)

            newLeft = pos.left + dx
            newTop = pos.top + dy

            const newPos = {
                top: newTop,
                left: newLeft
            }

            this.position = newPos

            const events = this.events.get('move')
            if(events && events.length){
                events.forEach(func => func({
                    pos: this.position,
                    dm: this.dimension,
                    rPos: this.relativePosition
                }))
            }
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

    private addElementListeners(){
        const el = this.element
        el?.addEventListener('mousemove', (e) => {
            this.detectMousePosition(e)
        })

        el?.addEventListener('mousedown', this.drag.bind(this))
    }

    mount(){
        if(this.mounted) return // we must not mount a dynode multiple times
        if(!this.options) throw new Error('Options not specified')
        
        const options = this.options
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

        // set rect
        if(options.position) this.position = options.position
        else this.initRect('pos')

        if(options.dimension) this.dimension = options.dimension
        else this.initRect('dm')

        const EDGE = options.edgeDetectPadding
        if(typeof EDGE !== 'undefined') this.EDGE = EDGE

        const bbp = options.boundByParent
        if(typeof bbp !== 'undefined') this.boundByParent = bbp

        this.addElementListeners()

        // const el = this.element
        el?.classList.add('dynode')
        this.mounted = true
        delete this['options']
    }

    on(key: EventKey, func: (e?: EventValue) => void){
        const evt = this.events.get(key)
        if(typeof evt === 'undefined') {
            this.events.set(key, [func])
        } else {
            evt.push(func)
            this.events.set(key, evt)
        }
    }
}

export default DynamicNode