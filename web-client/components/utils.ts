import {Selection} from "@nextui-org/react";
import {ChangeEvent} from "react";

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function minBy(array: any, fn: any) {
    return extremumBy(array, fn, Math.min);
};

export function maxBy(array: any, fn: any) {
    return extremumBy(array, fn, Math.max);
};

function extremumBy(array: [], pluck: any, extremum: any) {
    return array.reduce(function (best, next) {
        const pair = [pluck(next), next];
        if (!best) {
            return pair;
        } else if (extremum.apply(null, [best[0], pair[0]]) == best[0]) {
            return best;
        } else {
            return pair;
        }
    }, null as any)[1];
}

export function getSingleSelectedKey(selectedKeys: Selection) {
    const selectedKeysSet = selectedKeys as Set<string>;
    if (selectedKeysSet.size != 1) return;

    return selectedKeysSet.values().next().value;
}

export function handleObjectChange<Type>(e: ChangeEvent<HTMLInputElement>, setFunc: (mutateFunc: (prevState: Type) => Type) => void) {
    const {name, value} = e.target;
  
    const convertedValue = value === "true" || value === "false"
        ? value === "true"
        : value;

    setFunc((prevState: Type) => ({
        ...prevState,
        [name]: convertedValue
    }));
}