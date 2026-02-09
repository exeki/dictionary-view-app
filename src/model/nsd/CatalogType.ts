import SelectOption from "./SelectOption.ts";

export default interface CatalogType extends SelectOption {
    isWithFolders: boolean
    isFlat: boolean
}
