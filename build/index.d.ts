import { DynodeInterface, DynodeOptions, MousePositionType, DynodeDimension, DynodePosition, DynodeParent } from "./interface";
declare class Dynode implements DynodeInterface {
    element?: HTMLElement | undefined;
    parent?: DynodeParent | undefined;
    position?: DynodePosition | undefined;
    dimension?: DynodeDimension | undefined;
    boundByParent: boolean;
    EDGE: number;
    mousePosition?: MousePositionType | undefined;
    private atCorner;
    constructor(options: DynodeOptions);
    get getOverflow(): false | "top" | "bottom" | "left" | "right";
    /** Sets dynode's parent element */
    private setParent;
    private validateEl;
    private set setPosition(value);
    private set setDimension(value);
    private getMouseDistance;
    /** Sets Dynode's position or dimension values from input element's `getBoundingClientRect`. */
    private setRect;
    private resize;
    private move;
    /** Calls Dynode's `move` or `resize` actions. */
    private drag;
    /** Tries to detect mouse's position on the element.
     *
     * This helps to show the right cursor type and determine if the action should be `resize` or `move`.
    */
    private detectMousePosition;
    private addElementListeners;
    mount(): void;
}
export default Dynode;
