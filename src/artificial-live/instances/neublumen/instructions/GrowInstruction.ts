import { double } from "../../../../libs/CommonTypes";
import { constrains } from "../../../../libs/math/Mathmatics";
import Part from "../../../model/Part";
import Instruction from "../../../program/Instruction";
import { PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_SIZE } from "../NeublumenPropertyTypes";

export default class GrowInstruction implements Instruction {

    execute(part: Part, args: Array<any>): void {
        if (args.length < 1) throw new Error("Grow needs at least 1 arg");
        
        const grownValue: double = args[0];
        const costNutrition = grownValue * 10;
        const actualCostNutrition = part.properties.mutate(PROPERTY_TYPE_NUTRITION, -costNutrition);
        const previousSize = part.properties.get(PROPERTY_TYPE_SIZE);
        const actualGrownValue = constrains(Math.abs(actualCostNutrition) / 10, 0, 1 - previousSize);
        part.properties.mutate(PROPERTY_TYPE_SIZE, +actualGrownValue);
    }
}