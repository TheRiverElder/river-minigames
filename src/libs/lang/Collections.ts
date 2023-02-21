export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, getValue: () => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
        map.set(key, value);
    }
    return value;
}