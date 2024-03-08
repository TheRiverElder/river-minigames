import { Productor } from "../CommonTypes";
import { constrains } from "./Mathmatics";

export interface ValueAnimatorProps<T> {
    initialValue: T;
    duration: number;
    timingFunction?: Productor<number, number>;
    renderer: (frame: number, startValue: T, endValue: T) => T;
}


/**
 * 注意，这个组件不会自动更新，只会在重新渲染的时候计算出当时的变化
 */
export default class ValueAnimator<T = number> {

    value: T;
    duration: number;
    timingFunction?: Productor<number, number>;
    renderer: (frame: number, startValue: T, endValue: T) => T;
    
    private previousTime: number = 0;
    private previousValue: T;

    constructor(props: ValueAnimatorProps<T>) {
        this.value = props.initialValue;
        this.previousValue = this.value;
        this.duration = props.duration;
        this.timingFunction = props.timingFunction ?? (x => x);
        this.renderer = props.renderer;
        this.previousTime = Date.now();
    }

    update(value: T) {
        if (this.value !== value) {
            this.previousValue = this.value;
            this.value = value;
            this.previousTime = Date.now();
        }
    }

    getCurrent(): T {
        const { duration, timingFunction, value, renderer } = this;
        const previousValue = this.previousValue;

        const deltaTime = constrains(Date.now() - this.previousTime, 0, duration);
        const frame = (timingFunction ?? (x => x))(deltaTime / duration);

        return renderer(frame, previousValue, value);
    }

}