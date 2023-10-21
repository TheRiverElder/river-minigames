import Game from "../Game";
import { repeatRun } from "../../libs/lang/Extensions";
import MinerItem from "../model/item/MinerItem";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import OrbMiningLicenceItem from "../model/item/OrbMiningLisenceItem";
import ResourceItem from "../model/item/ResourceItem";
import MinerPartItem from "../model/item/MinerPartItem";
import SimpleItem from "../model/item/SimpleItem";
import FacilityItem from "../model/item/FacilityItem";
import { createRecipes } from "./TestRecipes";
import { createTechnologies } from "./TestTechnologies";
import { createItems } from "./TestItems";
import { peek } from "../../libs/lang/Collections";
import { prepareTextures } from "./TestTextures";
import { createOrbs } from "./TestOrbs";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(Object.values(ResourceTypes));
    game.itemTypes.addAll([
        OrbMiningLicenceItem.TYPE,
        MinerItem.TYPE,
        MinerPartItem.TYPE,
        ResourceItem.TYPE,
        SimpleItem.TYPE,
    ]);

    game.profile.account = 10000000;

    const internalOrbs = createOrbs(game);
    internalOrbs.forEach(it => game.world.orbs.add(it));
    repeatRun(() => game.discoverAndUpdateShop(), 3);
    
    game.shop.refreshGoods(game);

    createTechnologies().forEach(tech => game.technologies.add(tech));
    game.recipes.addAll(createRecipes());
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
        const resources = game.profile.warehouse.content.filter(it => it instanceof ResourceItem);
        orb.supplimentNetwork.resources.addAll(resources);
    }

    prepareTextures();

    return game;
}
