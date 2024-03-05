import React, { ChangeEvent } from "react";
import CommonInputProps from "./CommonInputProps";

export type BaseInputProps = CommonInputProps<string> & Omit<JSX.IntrinsicElements["input"], "value" | "onChange">;
export interface BaseInputState {
    rawValue: string;
}

export default class BaseInput extends React.Component<BaseInputProps, BaseInputState> {

    override state = {
        rawValue: this.props.value,
    };

    override render(): React.ReactNode {
        const {
            changeOnKey = true,
            changeOnBlur = false,
            changeOnEnter = false,
        } = this.props;

        const inputProps = {
            ...this.props,
            value: this.state.rawValue,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                console.log("onChange", this.state.rawValue)
                const value = e.target.value;
                this.setState({ rawValue: value });
                if (changeOnKey) this.props.onChange(value);
            },
            onBlur: changeOnBlur ? (() => this.props.onChange(this.state.rawValue)) : undefined,
            onKeyDown: changeOnEnter ? ((e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") this.props.onChange(this.state.rawValue);
            }) : undefined,
        };
        console.log("inputProps.value", inputProps.value);

        return (
            <input { ...inputProps }/>
        );
    }

    override shouldComponentUpdate(nextProps: Readonly<BaseInputProps>, nextState: Readonly<BaseInputState>, nextContext: any): boolean {
        if (nextProps.value !== this.props.value) this.state.rawValue = nextProps.value;
        return nextProps.value !== this.props.value || this.state.rawValue !== nextState.rawValue;
    }
}