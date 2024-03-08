import { int } from "../../../libs/CommonTypes";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { NumberInput } from "../../../libs/ui/NumberInput";
import { DialogContentProps } from "../frame/SimpleDialogWrapper";
import "./NumberInputDialog.scss";

export interface NumberInputDialogProps extends DialogContentProps<number> {
    min?: number;
    max?: number;
    step?: number;
    precision?: int;
}

export default function NumberInputDialog(props: NumberInputDialogProps) {
    return (
        <div className="NumberInputDialog">
            {(typeof props.max === 'number') && (
                <NumberInput
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    value={props.value}
                    precision={props.precision}
                    asRange
                    onChange={props.onChange}
                />
            )}
            <NumberInput
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onChange={props.onChange}
            />
            <div>
                <span className="range-hint">{shortenAsHumanReadable(props.min ?? 0)} ~ {shortenAsHumanReadable(props.max ?? 1)} by step {shortenAsHumanReadable(props.step ?? 1)}</span>
            </div>
        </div>
    );
}