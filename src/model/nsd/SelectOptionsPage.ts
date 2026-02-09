import Pager from "./Pager.ts";
import SelectOption from "./SelectOption.ts";

export default interface SelectOptionsPage {
    pager: Pager,
    options: SelectOption[]
}
