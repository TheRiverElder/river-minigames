import City from "./City";
import Traffic from "./traffic/Traffic";

export default class GameMap {
    readonly cities: Array<City>;
    readonly traffics: Array<Traffic>;

    constructor(cities: Iterable<City>, traffics: Iterable<Traffic>) {
        this.cities = Array.from(cities);
        this.traffics = Array.from(traffics);
        this.reconnectTraffics();
    }

    reconnectTraffics() {
        for (const city of this.cities) {
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