namespace utils {

    export function partition<T>(array: Array<T>, predicate: (arg: T) => boolean): [Array<T>, Array<T>] {
        const partitioned: [Array<T>, Array<T>] = [[], []];
        array.forEach(elem => partitioned[predicate(elem) ? 0 : 1].push(elem));
        return partitioned;
    }
    
}