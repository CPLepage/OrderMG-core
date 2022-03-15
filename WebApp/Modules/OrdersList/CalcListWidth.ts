import constants from "Shared/constants";

export default function () {
    return constants.defaultColumns.reduce((totalWidth, col) => totalWidth + (col.defaultWidth ?? 100), 0)
}
