import classNames from "classnames";
import { Component, CSSProperties, ReactNode } from "react";
import Vector2 from "../math/Vector2";
import { CheckBoxInput } from "./CheckBoxInput";
import CommonInputProps from "./CommonInputProps";
import { NumberInput, NumberInputProps } from "./NumberInput";
import "./Vector2Input.scss";

export interface Vector2InputProps extends CommonInputProps<Vector2> {
    className?: string;
    style?: CSSProperties;
    numberInputClassName?: string;
    numberInputStyle?: CSSProperties;
    allowKeepAspectRatio?: boolean;
    lazyConfirm?: boolean; // 开启则会显示一个确认按钮，按下确认按钮后才会执行onChange
}

export interface Vector2InputState {
    keepAspectRatio: boolean;
    editingX: number;
    editingY: number;
    edited: boolean,
}

export default class Vector2Input extends Component<Vector2InputProps, Vector2InputState> {

    constructor(props: Vector2InputProps) {
        super(props);
        this.state = {
            keepAspectRatio: true,
            editingX: props.value.x,
            editingY: props.value.y,
            edited: false,
        };
    }

    render(): ReactNode {
        
        const props = this.props;
        const state = this.state;
        
        const allowKeepAspectRatio: boolean = !!props.allowKeepAspectRatio;
        const lazyConfirm: boolean = !!props.lazyConfirm;

        // if (props.ref) props.ref.current = this;

        const numberInputProps: Partial<NumberInputProps> = {
            className: props.numberInputClassName,
            style: props.numberInputStyle,
            changeOnBlur: props.changeOnBlur,
            changeOnEnter: props.changeOnEnter,
            changeOnKey: props.changeOnKey,
        };

        return (
            <div
                className={classNames("Vector2Input", props.className)}
                style={props.style}
            >
                <NumberInput 
                    key={1}
                    {...numberInputProps}
                    value={this.getDimValue(DIM_X)} 
                    onChange={this.createSetter(DIM_X)}                    
                />
                <NumberInput 
                    key={2}
                    {...numberInputProps}
                    value={this.getDimValue(DIM_Y)} 
                    onChange={this.createSetter(DIM_Y)}                    
                />
                {allowKeepAspectRatio && [
                    <CheckBoxInput
                        key={3}
                        value={state.keepAspectRatio}
                        onChange={v => this.setState({ keepAspectRatio: v })}
                    />,
                    <span key={4}>🔗</span>
                ]}
                {lazyConfirm && (<button key={5} disabled={!state.edited}>Reset</button>)}
                {lazyConfirm && (<button key={6} disabled={!state.edited}>Confirm</button>)}
            </div>
        );
    }

    getDimValue(dim: DimensionFieldType): number {
        switch (dim) {
            case "x": return this.state.editingX;
            case "y": return this.state.editingY;
        }
        // switch (dim) {
        //     case "x": return updated ? this.state.editingX : this.props.value.x;
        //     case "y": return updated ? this.state.editingY : this.props.value.y;
        // }
    }

    createSetter(dim: DimensionFieldType) {
        return (v: number) => {
            const lazyConfirm: boolean = !!this.props.lazyConfirm;
            const keepAspectRatio: boolean = !!this.props.allowKeepAspectRatio && this.state.keepAspectRatio;

            const prevX = this.props.value.x;
            const prevY = this.props.value.y;
            let nextX = prevX;
            let nextY = prevY;
            const aspectRatio = prevY / prevX;
            switch (dim) {
                case "x": {
                    nextX = v;
                    if (keepAspectRatio) nextY = aspectRatio * nextX;
                    break;
                }
                case "y": {
                    nextY = v;
                    if (keepAspectRatio) nextX = nextY / aspectRatio;
                    break;
                }
            }

            this.setState({ 
                editingX: nextX, 
                editingY: nextY, 
                edited: true, 
            });

            if (!lazyConfirm) {
                this.props.onChange(new Vector2(nextX, nextY));
            }
        };
    }

    confirm() {
        const lazyConfirm: boolean = !!this.props.lazyConfirm;
        if (lazyConfirm) {
            this.setState({ edited: false });
            this.props.onChange(new Vector2(this.state.editingX, this.state.editingY));
        }
    }

}

type DimensionFieldType = "x" | "y";

const DIM_X = "x";
const DIM_Y = "y";