import { Component, ReactNode } from "react";
import "./AnimatedValue.scss";
import { Productor } from "../../../libs/CommonTypes";
import { constrains } from "../../../libs/math/Mathmatics";

export interface AnimatedValueProps<T> {
    initialValue?: T;
    value: T;
    duration: number;
    timingFunction?: Productor<number, number>;
    renderer: (frame: number, startValue: T, endValue: T) => JSX.Element;
}

/**
 * 注意，这个组件不会自动更新，只会在重新渲染的时候计算出当时的变化
 */
export default class AnimatedValue<T = number> extends Component<AnimatedValueProps<T>> {
    
    private previousTime: number = 0;
    private previousValue: T = this.props.initialValue ?? this.props.value;

    override render(): ReactNode {
        const { duration, timingFunction, value } = this.props;
        const previousValue = this.previousValue;

        const deltaTime = constrains(Date.now() - this.previousTime, 0, duration);
        const frame = (timingFunction ?? (x => x))(deltaTime / duration);

        return this.props.renderer(frame, previousValue, value);
    }
    
    componentDidMount(): void {
        this.previousTime = Date.now();
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<AnimatedValueProps<T>>, nextContext: any): void {
        if (this.props.value !== nextProps.value) {
            this.previousValue = this.props.value;
            this.previousTime = Date.now();
        }
    }
}