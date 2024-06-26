
import { ReactNode } from "react";
import { Pair } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import "./DistributionBar.scss";
import { SpaceMinerGameClientCommonProps } from "../common";

export interface DistributionBarProps extends SpaceMinerGameClientCommonProps {
    parts: Array<Pair<number, Nullable<ReactNode>> | [number]>;
}

export default function DistributionBar(props: DistributionBarProps) {
    const { parts } = props;

    const incomePartList: Array<Pair<number, Nullable<ReactNode>> | [number]> = [];
    let incomeTotal: number = 0; 
    const outcomePartList: Array<Pair<number, Nullable<ReactNode>> | [number]> = [];
    let outcomeTotal: number = 0; 

    for (const part of parts) {
        const [value] = part;
        if (value > 0) {
            incomePartList.push(part);
            incomeTotal += value;
        } else if (value < 0) {
            outcomePartList.push(part);
            outcomeTotal += value;
        }
    }

    const total = Math.max(Math.abs(incomeTotal), Math.abs(outcomeTotal));

    return (
        <div className="DistributionBar">
            <div className="parts income">
                {incomePartList.map(([value, view], index) => (<div key={index} className="part" style={{ width: `${value / total * 100}%` }}>{view}</div>))}
            </div>
            <div className="parts outcome">
                {outcomePartList.map(([value, view], index) => (<div key={index} className="part" style={{ width: `${-value / total * 100}%` }}>{view}</div>))}
            </div>
        </div>
    );
}