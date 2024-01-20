import { colorDataFromInt } from "../../libs/graphics/Graphics";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import { RESOURCE_TEXTURE_DRAWING_PRESETS } from "../ui/graphics/OrbGraphics";


export function prepareTextures() {
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.ROCK, { originColor: colorDataFromInt(0xE1D7C5), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.COAL, { originColor: colorDataFromInt(0x232020), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.PETROLEUM, { originColor: colorDataFromInt(0x232020), sizeRange: [2, 3] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.STRUCTIUM_ORE, { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.SILVER_ORE, { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.GOLD_ORE, { originColor: colorDataFromInt(0xD5D02A), sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.URANIUM_ORE, { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.HIGH_DENSITY_METAL, { originColor: colorDataFromInt(0x2A1744), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.RESONATING_CRYSTAL, { originColor: colorDataFromInt(0xCF5523), sizeRange: [3, 5] });

    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.STRUCTIUM, { originColor: colorDataFromInt(0x9BC965), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.SILVER, { originColor: colorDataFromInt(0xEAEFF2), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.GOLD, { originColor: colorDataFromInt(0xEBE618), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.URANIUM_238, { originColor: colorDataFromInt(0x85D72F), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.URANIUM_235, { originColor: colorDataFromInt(0xA6D72F), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.POLYMER, { originColor: colorDataFromInt(0xDADADA), sizeRange: [3, 5] });

    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.WOOD, { originColor: colorDataFromInt(0xB3A996), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set(ResourceTypes.BIOMASS, { originColor: colorDataFromInt(0x009933), sizeRange: [3, 5] });

}