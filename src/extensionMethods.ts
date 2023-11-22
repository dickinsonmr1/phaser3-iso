declare global {
    interface Array<T> {
        single: (predicate: (value: T) => boolean) => T;
    }
}

Array.prototype.single = function<T>(predicate: (value: T) => boolean): T {
    const result = this.find(predicate);
    if (result === undefined) {
        throw new Error("No matching element found.");
    }
    return result;
};

export {};

// https://reacthustle.com/blog/how-to-extend-array-object-in-typescript