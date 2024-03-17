export function createGameWorker(): Worker {
    return new Worker(new URL("./main", import.meta.url), {
        type: "module",
    });
}