import Game from "../model/global/Game"
import { ResourceTypes } from "../model/misc/ResourceTypes";

export default function initializeShop(game: Game) {

    const shop = game.shop;
    
    // 其它
    shop.basePrices.set(ResourceTypes.EMPTY, 0.0);
    shop.basePrices.set(ResourceTypes.WATER, 0.3);

    // 虚拟资源
    shop.basePrices.set(ResourceTypes.ELECTRICITY, 0.0);
    shop.basePrices.set(ResourceTypes.LIVE_SUPPORT, 0.0);
    shop.basePrices.set(ResourceTypes.SHIELD, 0.0);
    shop.basePrices.set(ResourceTypes.MONEY, 1.0);
    
    // 岩石矿物
    shop.basePrices.set(ResourceTypes.ROCK, 0.4);
    shop.basePrices.set(ResourceTypes.COAL, 1.5);
    shop.basePrices.set(ResourceTypes.PETROLEUM, 1.5);
    shop.basePrices.set(ResourceTypes.IRON_ORE, 1.0);
    shop.basePrices.set(ResourceTypes.STRUCTIUM_ORE, 3.0);
    shop.basePrices.set(ResourceTypes.SILVER_ORE, 10.0);
    shop.basePrices.set(ResourceTypes.GOLD_ORE, 40.0);
    shop.basePrices.set(ResourceTypes.URANIUM_ORE, 3000.0);
    shop.basePrices.set(ResourceTypes.RESONATING_CRYSTAL, 40000.0);

    // 精炼矿物
    shop.basePrices.set(ResourceTypes.IRON, 3.0);
    shop.basePrices.set(ResourceTypes.STRUCTIUM, 10.0);
    shop.basePrices.set(ResourceTypes.SILVER, 400.0);
    shop.basePrices.set(ResourceTypes.GOLD, 2000.0);
    shop.basePrices.set(ResourceTypes.URANIUM_238, 300000.0);
    shop.basePrices.set(ResourceTypes.URANIUM_235, 1200000.0);
    shop.basePrices.set(ResourceTypes.POLYMER, 1.0);
    shop.basePrices.set(ResourceTypes.HIGH_DENSITY_METAL, 30000.0);
    
    // 生物
    shop.basePrices.set(ResourceTypes.WOOD, 5.0);
    shop.basePrices.set(ResourceTypes.BIOMASS, 12.0);
    
    // 基础物理学
    shop.basePrices.set(ResourceTypes.CORE_LAVA, 1500.0);
    shop.basePrices.set(ResourceTypes.PLASMA_LAVA, 7500.0);
    shop.basePrices.set(ResourceTypes.METALLIC_HYTROGEN, 15000.0);
    shop.basePrices.set(ResourceTypes.NEUTRON, 80000.0);
    shop.basePrices.set(ResourceTypes.BLACK_HOLE, 1000000.0);

    // 精密材料
    shop.basePrices.set(ResourceTypes.MACRO_CPU, 500.0);
    shop.basePrices.set(ResourceTypes.MICRO_CPU, 8000.0);
    shop.basePrices.set(ResourceTypes.QUANTEM_CPU, 160000.0);
    shop.basePrices.set(ResourceTypes.PRIMATIVE_SHELL_MODULO, 150.0);
    shop.basePrices.set(ResourceTypes.ADVANCED_SHELL_MODULO, 1200.0);
    shop.basePrices.set(ResourceTypes.DROP_SHELL_MODULO, 6000.0);

    // 机器
    shop.basePrices.set(ResourceTypes.ORE_PROCESSING_MACHINE, 100.0);
    shop.basePrices.set(ResourceTypes.COLLAPSING_MACHINE, 100.0);
    shop.basePrices.set(ResourceTypes.ASSEMBLING_MACHINE, 100.0);
    shop.basePrices.set(ResourceTypes.STABLIZING_MACHINE, 100.0);

}