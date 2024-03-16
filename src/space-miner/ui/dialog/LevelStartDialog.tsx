import "./LevelStartDialog.scss";
import I18n from "../../../libs/i18n/I18n";
import { toPercentString } from "../../../libs/lang/Extensions";
import Level from "../../model/level/Level";
import classNames from "classnames";
import { Component, ReactNode } from "react";
import ConfiguredGoal from "../../model/level/ConfiguredGoal";

export interface LevelStartDialogProps {
    i18n: I18n;
    level: Level;
}

export default function LevelStartDialog(props: LevelStartDialogProps) {
    const { i18n, level } = props;
    const goals = level.displayedGoals;

    return (
        <div className="LevelStartDialog">
            <h3 className="title">{level.getTitle().process(i18n)}</h3>
            {level.getDescription().process(i18n).split("\n").map(text => (
                <p className="description">{text}</p>
            ))}
            <div className="goals">
                {goals.map((goal, index) => (
                    <LevelStartDialogGoalView key={index}
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
    level: Level;
    goal: ConfiguredGoal;
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

        const completed = goal.completed;
        const g = goal.goal;
        // const hidden = completed && goal.hiddenAfterComplete;

        return (
            <div
                className={classNames("goal", { completed })}
                onClick={() => this.setState(s => ({ expanded: !s.expanded }))}
            >
                <div className="info">
                    <span className="name">{g.getName().process(i18n)}</span>
                    <span className="goal-text">{g.getProgressText().process(i18n)}/{g.getGoalText().process(i18n)}</span>
                    <progress max={1} value={g.getProgress()} />
                    <span className="progress-text">{toPercentString(g.getProgress())}</span>
                </div>
                {this.state.expanded && (
                    <div className="description">
                        aaa
                    </div>
                )}
            </div>
        );
    }
}