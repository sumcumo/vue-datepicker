# Available props


| Prop                          | Type             | Default     | Description                                     |
| ----------------------------- | -----------------| ----------- | ----------------------------------------------- |
| append-to-body                | Boolean          | false       | Append datepicker calendar to body              |
| autofocus                     | String           |             | Sets html `autofocus` attribute on input        |
| bootstrap-styling             | Boolean          | false       | Use bootstrap v4 styling classes.               |
| calendar-button               | Boolean          | false       | Show an icon that that can be clicked           |
| calendar-button-icon          | String           |             | Use icon for button (ex: fa fa-calendar)        |
| calendar-button-icon-content  | String           |             | Use for material-icons (ex: event)              |
| calendar-class                | String&#124;Object |           | CSS class applied to the calendar el            |
| clear-button                  | Boolean          | false       | Show an icon for clearing the date              |
| clear-button-icon             | String           |             | Use icon for button (ex: fa fa-times)           |
| day-cell-content              | Function         |             | Use to render custom content in day cell        |
| disabled                      | Boolean          | false       | If `true`, disable Datepicker on screen         |
| disabled-dates                | Object           |             | See below for configuration                     |
| first-day-of-week             | String           | sun         | Sets the first day of the week. Possible values: _sun_, _mon_, _tue_, _wed_, _thu_, _fri_, _sat_ |
| fixed-position                | String           |             | Set a fixed position for the picker. Possible values: _bottom_, _bottom-left_, _bottom-right_, _top_, _top-left_ and _top-right_ |
| format                        | String&#124;Function | dd MMM yyyy | Date formatting string or function          |
| full-month-name               | Boolean          | false       | To show the full month name                     |
| id                            | String           |             | Input id                                        |
| initial-view                  | String           | minimumView | If set, open on that view                       |
| inline                        | Boolean          |             | To show the datepicker always open              |
| input-class                   | String&#124;Object&#124;Array| | CSS class(es) applied to the input element      |
| language                      | Object           | en          | Translation for days and months                 |
| maxlength                     | String           |             | Sets html `maxlength` attribute on input        |
| maximum-view                  | String           | year        | If set, higher-level views won't show           |
| minimum-view                  | String           | day         | If set, lower-level views won't show            |
| name                          | String           |             | Input name property                             |
| open-date                     | Date&#124;String |             | If set, open on that date                       |
| pattern                       | String           |             | Sets html `pattern` attribute on input          |
| placeholder                   | String           |             | Input placeholder text                          |
| required                      | Boolean          | false       | Sets html required attribute on input           |
| ref-name                      | String           |             | Sets a ref name directly on the input field     |
| show-edge-dates               | Boolean          | true        | If `false`, dates from previous/next months won't show       |
| show-header                   | Boolean          | true        | If `false`, the header section won't show       |
| show-calendar-on-focus        | Boolean          | false       | Opens the calendar on input focus               |
| show-calendar-on-button-click | Boolean          | false       | Only open the calendar on calendar-button click |
| tabindex                      | String&#124;Number |           | Tabindex for the input field                    |
| typeable                      | Boolean          | false       | If `true`, allow the user to type the date      |
| use-utc                       | Boolean          | false       | Use UTC for time calculations                   |
| value                         | Date&#124;String |             | Date value of the datepicker                    |
| wrapper-class                 | String&#124;Object |           | CSS class applied to the outer div              |
| year-picker-range             | Number           | 10          | How many years to display in the _year picker_  |
