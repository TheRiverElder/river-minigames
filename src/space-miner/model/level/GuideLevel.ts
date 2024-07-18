import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text, { TextModel } from "../../../libs/i18n/Text";
import { filterNotNull, peek } from "../../../libs/lang/Collections";
import { repeatRun } from "../../../libs/lang/Extensions";
import Optional, { Nullable } from "../../../libs/lang/Optional";
import { createItems } from "../../test/TestItems";
import { createOrbs } from "../../test/TestOrbs";
import { createRecipes } from "../../test/TestRecipes";
import initializeShop from "../../test/TestShop";
import { createTechnologies } from "../../test/TestTechnologies";
import Game from "../global/Game";
import FacilityItem from "../item/FacilityItem";
import ConfiguredGoal from "./ConfiguredGoal";
import Goal from "./Goal";
import Level, { LevelInfoModel, LevelModel } from "./Level";
import LevelCheckedGoal from "./LevelCheckedGoal";

export default class GuideLevel implements Level {

    public readonly goals: Array<ConfiguredGoal<GuideLevel>>;

    constructor(
        public readonly game: Game,
        public readonly name: string,
        goals: Array<Goal>,
    ) {
        this.goals = goals.map(it => new ConfiguredGoal(this, it))
    }

    setup(): void {
        const game = this.game;

        game.profile.account = 0;

        const internalOrbs = createOrbs(game);
        internalOrbs.forEach(it => game.world.orbs.add(it));
        repeatRun(() => game.discoverAndUpdateShop(), 3);

        game.shop.refreshGoods(game);

        createTechnologies().forEach(tech => game.technologies.add(tech));
        game.recipes.addAll(createRecipes(game));
        initializeShop(game);
        // initializeTestTraders(game);
        game.profile.warehouse.addAll(createItems(game));

        {
            const [orbMiningLicence] = game.shop.items.splice(0, 1);

            game.profile.warehouse.add(orbMiningLicence);
            game.actions.useItem(peek(game.profile.warehouse.content), game.profile.warehouse, game.profile);

            const orb = internalOrbs[0];
            game.actions.claimOrb(orb, game.profile);
            const facilities = game.profile.warehouse.content.filter(it => it instanceof FacilityItem);
            facilities.forEach(facility => {
                const f = facility as FacilityItem;
                game.actions.deploy(orb, [f], game.profile);
            });
        }
    }

    getDisplayedModel(): LevelModel {
        return {
            title: this.getTitle().getDisplayedModel(),
            description: this.getDescription().getDisplayedModel(),
            displayedGoals: Optional.ofNullable(this.currentGoal).map(it => [it.getDisplayedModel()]).orElse([]),
            displayedCompleted: this.currentGoal?.hadCompleted ?? false,
        };
    }

    getDisplayedInfoModel(): LevelInfoModel {
        return {
            title: this.getTitle().getDisplayedModel(),
            displayedGoals: Optional.ofNullable(this.currentGoal).map(it => [it.getDisplayedInfoModel()]).orElse([]),
        };
    }

    get completed(): boolean {
        return this.ordinal >= this.goals.length;
    }

    getTitle(): Text {
        const currentGoal = this.currentGoal;
        const completed = !!currentGoal?.hadCompleted;
        return new I18nText(completed ? `level.${this.name}.title.completed` : `level.${this.name}.title`, { "goal_name": currentGoal?.goal.getName() ?? "" });
    }

    getDescription(): Text {
        const texts: Text[] = [
            new I18nText(`level.${this.name}.description.${this.ordinal}`),
        ];
        if (this.currentGoal) {
            texts.push(new PlainText("\n"), this.currentGoal.goal.getDescription());
        }
        return new ChainText(texts);
    }

    get currentGoal(): Nullable<ConfiguredGoal> {
        return this.goals[this.ordinal];
    }

    private ordinal = 0;

    get displayedGoals() {
        return filterNotNull([this.currentGoal]);
    }

    postTick(game: Game) {
        if (this.completed) return;
        this.currentGoal?.postTick();
    }

    onGoalComplete(goal: Goal): void {
        this.game.displayMessage(new I18nText(`level.${this.name}.goal_complete`, { "goal_name": goal.getName() }));
        setTimeout(() => this.game.listeners.OVERLAY.emit("level_start"), 0);
    }

    onChecked(): void {
        const g = this.currentGoal;
        if (!g) return;

        const prevCompleted = g.hadCompleted;

        if (g.goal instanceof LevelCheckedGoal) {
            g.goal.checked = true;
        }

        const nowCompleted = g.completed;

        if (!prevCompleted) {
            if (nowCompleted) {
                this.ordinal++;
                this.game.listeners.OVERLAY.emit("level_start");
            } else {

            }
        } else {
            this.ordinal++;
            this.game.listeners.OVERLAY.emit("level_start");
        }
    }
}