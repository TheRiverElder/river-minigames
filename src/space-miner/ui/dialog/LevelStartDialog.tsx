import "./LevelStartDialog.scss";
import I18n from "../../../libs/i18n/I18n";
import Text from "../../../libs/i18n/Text";
import { toPercentString } from "../../../libs/lang/Extensions";
import Level from "../../model/level/Level";
import classNames from "classnames";

export interface LevelStartDialogProps {
    i18n: I18n;
    level: Level;
    title: Text;
    description?: Text;
}

export default function LevelStartDialog(props: LevelStartDialogProps) {
    const { i18n, level, title, description } = props;
    const { goals } = level;

    return (
        <div className="LevelStartDialog">
            <h3 className="title">{title.process(i18n)}</h3>
            <p className="description">{description?.process(i18n)}</p>
            <div className="goals">
                {goals.map(goal => (
                    <div className={classNames("goal", { completed: goal.getProgress() >= 1 })}>
                        <span className="name">{goal.getName().process(i18n)}</span>
                        <span className="goal-text">{goal.getGoalText().process(i18n)}</span>
                        <progress max={1} value={goal.getProgress()} />
                        <span className="progress-text">{toPercentString(goal.getProgress())}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}