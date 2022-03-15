// source : https://stackoverflow.com/a/6394168
export default function getValue (obj: object, path: Path, value: any = null) {
    if (typeof path == 'string')
        return getValue(obj, path.split('.'), value);
    else if (path.length === 1 && value !== null)
        return obj[path[0]] = value;
    else if (path.length==0)
        return obj;
    else
        return getValue(obj[path[0]], path.slice(1), value);
}
