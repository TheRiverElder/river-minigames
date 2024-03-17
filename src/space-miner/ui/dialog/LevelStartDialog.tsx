import "./LevelStartDialog.scss";
import I18n from "../../../libs/i18n/I18n";
import { toPercentString } from "../../../libs/lang/Extensions";
import { LevelModel } from "../../model/level/Level";
import classNames from "classnames";
import { Component, ReactNode } from "react";
import { GoalModel } from "../../model/level/ConfiguredGoal";
import { restoreText, restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";

export interface LevelStartDialogProps {
    i18n: I18n;
    level: LevelModel;
}

export default function LevelStartDialog(props: LevelStartDialogProps) {
    const { i18n, level } = props;
    const goals = level.displayedGoals;

    return (
        <div className="LevelStartDialog">
            <h3 className="title">{restoreText(level.title).process(i18n)}</h3>
            {restoreText(level.description).process(i18n).split("\n").map(text => (
                <p className="description">{text}</p>
            ))}
            <div className="goals">
                {goals.map((goal, index) => (
                    <LevelStartDialogGoalView
                        key={index}
                        goal={goal}
                        {...props}
                    />
                ))}
            </div>
        </div>
    )
}

interface LevelStartDialogGoalViewProps {
    i18n: I18n;
    goal: GoalModel;
}

interface LevelStartDialogGoalViewState {
    expanded: boolean;
}

class LevelStartDialogGoalView extends Component<LevelStartDialogGoalViewProps, LevelStartDialogGoalViewState> {

    state = {
        expanded: false,
    };

    override render(): ReactNode {
        const { i18n, goal } = this.props;

        const completed = goal.progress >= 1;
        // const hidden = completed && goal.hiddenAfterComplete;

        return (
            <div
                className={classNames("goal", { completed })}
                onClick={() => this.setState(s => ({ expanded: !s.expanded }))}
            >
                <div className="info">
                    <span className="name">{restoreTextAndProcess(goal.name, i18n)}</span>
                    <span className="goal-text">{restoreTextAndProcess(goal.progressText, i18n)}/{restoreTextAndProcess(goal.goalText, i18n)}</span>
                    <progress max={1} value={goal.progress} />
                    <span className="progress-text">{toPercentString(goal.progress)}</span>
                </div>
                {this.state.expanded && (
                    <div className="description">
                        {restoreTextAndProcess(goal.description, i18n)}
                    </div>
                )}
            </div>
        );
    }
}