# Events

These events are emitted on actions in the datepicker

| Event                                           | Output     | Description                           |
|-------------------------------------------------| ---------- | ------------------------------------- |
| changed-month                                   | Object     | Month page has been changed           |
| changed-year                                    | Object     | Year page has been changed            |
| changed-decade                                  | Object     | Decade page has been changed          |
| cleared                                         |            | Selected date has been cleared        |
| closed                                          |            | The picker has been closed            |
| input                                           | Date\|null | A date has been selected              |
| opened                                          |            | The picker has been opened            |
| selected <br/>*(deprecated in favour of input)* | Date\|null | A date has been selected |
| blur                                            |            | Input blur event                      |
| focus                                           |            | Input focus event                     |
