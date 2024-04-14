import { colorDataFromInt } from "../../libs/graphics/Graphics";
import { RESOURCE_TEXTURE_DRAWING_PRESETS } from "../ui/graphics/OrbGraphics";


export function prepareTextures() {
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("rock", { originColor: colorDataFromInt(0xE1D7C5), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("coal", { originColor: colorDataFromInt(0x232020), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("petroleum", { originColor: colorDataFromInt(0x232020), sizeRange: [2, 3] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("structium_ore", { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("silver_ore", { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("gold_ore", { originColor: colorDataFromInt(0xD5D02A), sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("uranium_ore", { sizeRange: [5, 8] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("high_density_metal", { originColor: colorDataFromInt(0x2A1744), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("resonating_crystal", { originColor: colorDataFromInt(0xCF5523), sizeRange: [3, 5] });

    RESOURCE_TEXTURE_DRAWING_PRESETS.set("structium", { originColor: colorDataFromInt(0x9BC965), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("silver", { originColor: colorDataFromInt(0xEAEFF2), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("gold", { originColor: colorDataFromInt(0xEBE618), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("uranium_238", { originColor: colorDataFromInt(0x85D72F), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("uranium_235", { originColor: colorDataFromInt(0xA6D72F), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("polymer", { originColor: colorDataFromInt(0xDADADA), sizeRange: [3, 5] });

    RESOURCE_TEXTURE_DRAWING_PRESETS.set("wood", { originColor: colorDataFromInt(0xB3A996), sizeRange: [3, 5] });
    RESOURCE_TEXTURE_DRAWING_PRESETS.set("biomass", { originColor: colorDataFromInt(0x009933), sizeRange: [3, 5] });

}