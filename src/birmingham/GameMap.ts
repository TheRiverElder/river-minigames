import Registry from "../libs/management/Registry";
import Vector2 from "../libs/math/Vector2";
import City from "./City";
import Traffic from "./traffic/Traffic";

export default class GameMap {
    size: Vector2;
    industrySlotSize: Vector2;
    readonly cities: Registry<string, City> = new Registry(o => o.name);
    readonly traffics: Array<Traffic>;

    constructor(size: Vector2, industrySlotSize: Vector2, traffics: Iterable<Traffic>) {
        this.size = size;
        this.industrySlotSize = industrySlotSize;
        this.traffics = Array.from(traffics);
        this.reconnectTraffics();
    }

    reconnectTraffics() {
        for (const city of Array.from(this.cities.values())) {
            city.traffics.clear();
        }

        for (const traffic of this.traffics) {
            for (const city of traffic.getEnds()) {
                city.traffics.add(traffic);
            }
        }
    }

    canReach(startCity: City, endCity: City) {
        const visited: Set<City> = new Set([startCity]);
        const queue: Array<City> = [startCity];
        while (queue.length > 0) {
            const city = queue.shift();
            if (!city) break;
            if (city === endCity) return true;
            visited.add(city);
            city.traffics.forEach(traffic => {
                if (!traffic.isBuilt()) return;
                const nextCity = traffic.getAnotherEnd(city);
                if (visited.has(nextCity)) return;
                queue.push(nextCity);
            });
        }

        return false;
    }
}