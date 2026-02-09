import ruRU from "ant-design-vue/es/locale/ru_RU";

//Локализация частично есть из коробки, если ее подключить
//Но некоторые вещи переопределены
const localization: Record<any, any> = {
    ...ruRU,
    Pagination: {
        ...ruRU.Pagination,
        items_per_page: ' '
    },
    Table: {
        ...ruRU.Table,
        filterTitle: 'Фильтр',
        filterConfirm: 'ОК',
        filterReset: 'Сбросить',
        filterEmptyText: 'Нет фильтров',
        filterCheckall: 'Выбрать все',
        filterSearchPlaceholder: 'Поиск в фильтрах',
        selectAll: 'Выбрать всё',
        selectInvert: 'Инвертировать выбор',
        selectNone: 'Очистить всё',
        selectionAll: 'Выбрать все данные',
        sortTitle: 'Сортировка',
        expand: 'Развернуть',
        collapse: 'Свернуть',
        triggerDesc: 'Сортировать по убыванию',
        triggerAsc: 'Сортировать по возрастанию',
        cancelSort: 'Отменить сортировку'
    }
}

export default localization
