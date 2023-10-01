
import { ReactNode } from "react";
import { Pair } from "../../../libs/CommonTypes";
import SpaceMinerUICommonProps from "../SpaceMinerUICommonProps";
import "./DistributionBar.scss";

export interface DistributionBarProps extends SpaceMinerUICommonProps {
    parts: Array<Pair<number, ReactNode>>;
}

export default function DistributionBar(props: DistributionBarProps) {
    const { parts } = props;

    const incomePartList: Array<Pair<number, ReactNode>> = [];
    let incomeTotal: number = 0; 
    const outcomePartList: Array<Pair<number, ReactNode>> = [];
    let outcomeTotal: number = 0; 

    for (const part of parts) {
        const [value, view] = part;
        if (value > 0) {
            incomePartList.push(part);
            incomeTotal += value;
        } else if (value < 0) {
            outcomePartList.push(part);
            outcomeTotal += value;
        }
    }

    const total = Math.max(incomeTotal, outcomeTotal);

    return (
        <div className="DistributionBar">
            <div className="parts income">
                {incomePartList.map(([value, view]) => (<div className="part" style={{ width: `${value / total * 100}%` }}>{view}</div>))}
            </div>
            <div className="parts outcome">
                {outcomePartList.map(([value, view]) => (<div className="part" style={{ width: `${-value / total * 100}%` }}>{view}</div>))}
            </div>
        </div>
    );
}