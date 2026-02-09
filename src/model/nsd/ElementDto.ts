import BaseObject from "./BaseObject.ts";

export default interface ElementDto extends BaseObject {
    key: number
    color: string
    removed: boolean
    code: string
    fileUuid: string
    parent: BaseObject
    folder: boolean
}
