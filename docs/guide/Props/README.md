# Available props

These props can be used.

| Prop                          | Type            | Default     | Description                              |
|-------------------------------|-----------------|-------------|------------------------------------------|
| bootstrap-styling             | Boolean         | false       | Use bootstrap v4 styling classes.        |
| calendar-button               | Boolean         | false       | Show an icon that that can be clicked    |
| calendar-button-icon          | String          |             | Use icon for button (ex: fa fa-calendar) |
| calendar-button-icon-content  | String          |             | Use for material-icons (ex: event)       |
| calendar-class                | String\|Object  |             | CSS class applied to the calendar el     |
| clear-button                  | Boolean         | false       | Show an icon for clearing the date       |
| clear-button-icon             | String          |             | Use icon for button (ex: fa fa-times)    |
| day-cell-content              | Function        |             | Use to render custom content in day cell |
| disabled                      | Boolean         | false       | If true, disable Datepicker on screen    |
| disabled-dates                | Object          |             | See below for configuration              |
| fixedPosition                 | String          |             | Set a fixed position for the picker      |
| format                        | String\|Function| dd MMM yyyy | Date formatting string or function       |
| full-month-name               | Boolean         | false       | To show the full month name              |
| id                            | String          |             | Input id                                 |
| initial-view                  | String          | minimumView | If set, open on that view                |
| inline                        | Boolean         |             | To show the datepicker always open       |
| input-class                   | String\|Object  |             | CSS class applied to the input el        |
| language                      | Object          | en          | Translation for days and months          |
| maximum-view                  | String          | 'year'      | If set, higher-level views won't show    |
| minimum-view                  | String          | 'day'       | If set, lower-level views won't show     |
| monday-first                  | Boolean         | false       | To start the week on Monday              |
| name                          | String          |             | Input name property                      |
| open-date                     | Date\|String    |             | If set, open on that date                |
| placeholder                   | String          |             | Input placeholder text                   |
| required                      | Boolean         | false       | Sets html required attribute on input    |
| show-header                   | Boolean         | true        | If false, the header section won't show  |
| typeable                      | Boolean         | false       | If true, allow the user to type the date |
| use-utc                       | Boolean         | false       | use UTC for time calculations            |
| value                         | Date\|String    |             | Date value of the datepicker             |
| wrapper-class                 | String\|Object  |             | CSS class applied to the outer div       |
