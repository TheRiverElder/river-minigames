import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import Goal from "./Goal";
import GoalBase from "./GoalBase";

export default class MoneyAmountGoal extends GoalBase {

    readonly game: Game;
    readonly targetAmount: double;

    constructor(game: Game, targetAmount: double) {
        super();
        this.game = game;
        this.targetAmount = targetAmount;
    }


    getName(): Text { return new I18nText(`goal.money_amount.name`); }
    getDescription(): Text { return new I18nText(`goal.money_amount.description`); }

    getProgressText(): Text { return new PlainText((this.game.profile.account).toFixed(0) + " Cd."); }
    getGoalText(): Text { return new PlainText(this.targetAmount + " Cd."); }

    getProgress(): number {
        return this.game.profile.account / this.targetAmount;
    }
    
}