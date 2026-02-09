import Preferences from "./Preferences.ts";
import Filter from "./Filter.ts";
import Sorter from "./Sorter.ts";
import Pager from "./Pager.ts";

export default interface PageParams {
    preferences: Preferences
    filter: Filter
    sorter: Sorter
    pager: Pager
}
