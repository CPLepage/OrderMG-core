import {ReactElement} from "react";
import {render} from "react-dom";

export function renderPromise(jsx: ReactElement | string, container: HTMLElement): Promise<void> {
    return new Promise(resolve => render(jsx, container, resolve));
}

export function blobToText(blob: Blob): Promise<string> {
    const fileReader = new FileReader();
    return new Promise(res => {
        fileReader.addEventListener("loadend", () => {
            res(fileReader.result.toString());
        });
        fileReader.readAsText(blob);
    })
}

// source: https://stackoverflow.com/a/51567564
export function isColorLight(color: string){
    color = color.startsWith("#") ? color.substring(1) : color;
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
}
