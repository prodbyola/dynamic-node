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
export const proportionalScale = (options: PropOptions): number => {
    const n2 = ((options.n1 * options.m2) / options.m1).toFixed();
    return parseInt(n2);
};

/**
 * Gets the distance between mouse's current position and it's previous position.
 * @param {MouseEvent} e - MouseEvent
 * @param init - Previous XY position
 * @returns 
 */
export const getMouseDistance = (e: MouseEvent, init: {x: number, y: number}) => {
    const mpCurrent = {
        x: e.clientX,
        y: e.clientY
    }

    const dx = mpCurrent.x - init.x, dy = mpCurrent.y - init.y

    return [dx, dy]
}