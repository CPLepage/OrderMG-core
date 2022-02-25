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
