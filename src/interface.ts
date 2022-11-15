export const MOUSE_POSITIONS = ['top', 'bottom', 'left', 'right', 'top-right', 'top-left', 'bottom-right', 'bottom-left'] as const
export type MousePositionType = typeof MOUSE_POSITIONS[number]
export type MouseDirectionType = 'left' | 'right' | 'up' | 'down' | undefined;
export type EventKey = 'resize' | 'move'
export type EventValue = {
    dm: DynodeDimension
    pos: DynodePosition
    rPos: DynodePosition
}

export type DynodePosition = {
    top: number
    left: number
}

export type DynodeDimension = {
    width: number
    height: number
}

export type DynodeParent = {
    element?: HTMLElement
    position?: DynodePosition
    dimension?: DynodeDimension
    isRelative?: boolean
}

export type DynodeOptions = {
    /** This could be a `string` as a unique `id` of the element or it could be an instance of 
     * `HTMLElement`. */
    element: string | HTMLElement

    position?: DynodePosition
    dimension?: DynodeDimension

    /** Restrict dynode's movements to parent's boundary. */
    boundByParent?: boolean
    
    /** The amount of space (in px) within which element's edges are detected. Defaults to `6`. */
    edgeDetectPadding?: number
}

export interface DynodeInterface {
    element?: HTMLElement
    
    /** The four essential client rect values of the element: `top`, `left`, `width`, `height`. */
    position?: DynodePosition,
    dimension?: DynodeDimension,

    /** Direct parent node of the element. */
    parent?: DynodeParent

    /** See `edgeDetectPadding` of `DynodeOptions.` */
    EDGE: number

    /** The mouse's position on the node */
    mousePosition?: MousePositionType;

    /** Restrict dynode's movements to parent's boundary. */
    boundByParent?: boolean
    
    mount: () => void
    on: (key: EventKey, func: (e?: EventValue) => void) => void
} 