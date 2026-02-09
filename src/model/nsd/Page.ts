import Preferences from "./Preferences.ts";
import ElementDto from "./ElementDto.ts";
import Sorter from "./Sorter.ts";
import Pager from "./Pager.ts";
import Filter from "./Filter.ts";

export default interface Page {
    elements: ElementDto[]
    preferences: Preferences
    filter: Filter
    sorter: Sorter
    pager: Pager
}
