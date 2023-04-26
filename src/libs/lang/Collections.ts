import { int } from "../CommonTypes";

export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, getValue: () => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
        map.set(key, value);
    }
    return value;
}

export function mutate<K, V>(map: Map<K, V>, key: K, getValue: () => V , mutate: (value: V) => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
    }
    map.set(key, mutate(value));
    return value;
}

export function createArray<T>(length: int, generateElement: (index: int) => T): Array<T> {
    const array = Array<T>(length);
    for (let index = 0; index < array.length; index++) {
        array[index] = generateElement(index);
    }
    return array;
}

export function filterNotNull<T>(array: Array<T | null>): Array<T> {
    const result: Array<T> = [];
    for (const element of array) {
        if (element === null) continue;
        result.push(element);
    }
    return result;
}

export function removeFromArray<T>(array: Array<T>, element: T): boolean {
    const index = array.indexOf(element);
    if (index < 0) return false;
    array.splice(index, 1);
    return true;
}