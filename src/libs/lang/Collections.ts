import { int } from "../CommonTypes";

export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, getValue: () => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
        map.set(key, value);
    }
    return value;
}

export function createArray<T>(length: int, generateElement: (index: int) => T): Array<T> {
    const array = Array<T>(length);
    for (let index = 0; index < array.length; index++) {
        array[index] = generateElement(index);
    }
    return array;
}