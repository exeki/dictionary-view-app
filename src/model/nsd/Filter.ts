export default interface Filter {
    title: string | null
    code: string | null
    folder : boolean | null
    removed: boolean | null
    parentObject: string | null
    parentTitle: string | null
    parentCode: string | null
    parentFolder : boolean | null
    parentRemoved : boolean | null
}
