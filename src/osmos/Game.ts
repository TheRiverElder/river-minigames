import { int, Productor } from "../libs/CommonTypes";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import { randInt } from "../libs/math/Mathmatics";
import PseudoRandom from "../libs/math/PseudoRandom";
import Vector2 from "../libs/math/Vector2";
import Body from "./body/Body";
import NeutralBody from "./body/NeutralBody";
import PlayerBody from "./body/PlayerBody";

export default class Game {
    
    readonly bodies = new Registry<int, Body>(it => it.uid);
    player!: PlayerBody;

    tick() {
        this.bodies.values().forEach(it => it.tick(this));
        this.bodies.values().filter(it => it.mass === 0).forEach(it => this.bodies.remove(it));
        this.bodies.values().forEach(it => (it.position = it.position.add(it.velocity.mul(50.0 / 1000))));
    }

    private uidGenerator = new IncrementNumberGenerator(1);

    spawn<T extends Body>(productor: Productor<int, T>): T {
        const body = productor(this.uidGenerator.generate());
        this.bodies.add(body);
        return body;
    }

    initialize(seed: int = randInt(0, Number.MAX_SAFE_INTEGER)) {
        const random = new PseudoRandom(seed);
        const bodyAmount = random.nextInt(3, 8);
        for (let i = 0; i < bodyAmount; i++) {
            this.spawn(uid => new NeutralBody({
                uid,
                position: new Vector2(random.nextFloat(-500, 500), random.nextFloat(-500, 500)),
                velocity: Vector2.fromPolar(random.nextFloat(-Math.PI, Math.PI), random.nextFloat(0, 200)),
                mass: random.nextFloat(100, 600),
            }));
        }
        this.player = this.spawn(uid => new PlayerBody({ uid }));
    }
}