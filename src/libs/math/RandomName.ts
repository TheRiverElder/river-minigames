import { capitalize } from "../lang/Extensions";
import { randOne } from "./Mathmatics";
import NativeRandom from "./NativeRandom";
import Random from "./Random";

export function randomNameAlphabet(random: Random = NativeRandom.INSTANCE): string {
    const amount = random.nextInt(2, 5);
    const parts: Array<string> = [];
    for (let i = 0; i < amount; i++) {
        const letters: Array<string> = [];

        if (i > 0 || random.next() < 0.5) letters.push(randOne(CONSTANTS, random)); 
        
        letters.push(randOne(VOWELS, random));
        
        if (random.next() < 0.8) letters.push(randOne(CONSTANTS, random));

        const part = letters.join("");
        parts.push(part);
    }
    return capitalize(parts.join(""));
}

const CONSTANTS = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "ß", "þ", "ŋ", "ş"];
const VOWELS = ["a", "e", "i", "o", "u", "ä", "ö", "ü", "œ"];