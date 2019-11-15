# Translations

You can import only the translations that you need

```vue
<template>
  <datepicker :language="en"></datepicker>
</template>
<script>
  import {en} from '@sumcumo/vue-datepicker/dist/locale'
  
  export default {
    data () {
        return {
          en: en,
        }
    }
  }
</script>
```

Available languages

| Abbr        | Language         |          |
| ----------- |------------------|----------|
| af          | Afrikaans        |          |
| ar          | Arabic           |          |
| bg          | Bulgarian        |          |
| bs          | Bosnian          |          |
| ca          | Catalan          |          |
| cs          | Czech            |          |
| da          | Danish           |          |
| de          | German           |          |
| ee          | Estonian         |          |
| el          | Greek            |          |
| en          | English          | *Default*|
| es          | Spanish          |          |
| fa          | Persian (Farsi)  |          |
| fi          | Finnish          |          |
| fo          | Faroese          |          |
| fr          | French           |          |
| ge          | Georgia          |          |
| gl          | Galician         |          |
| he          | Hebrew           |          |
| hu          | Hungarian        |          |
| hr          | Croatian         |          |
| id          | Indonesian       |          |
| is          | Icelandic        |          |
| it          | Italian          |          |
| ja          | Japanese         |          |
| kk          | Kazakh           |          |
| ko          | Korean           |          |
| lb          | Luxembourgish    |          |
| lt          | Lithuanian       |          |
| lv          | Latvian          |          |
| mn          | Mongolian        |          |
| nbNO        | Norwegian Bokmål |          |
| nl          | Dutch            |          |
| pl          | Polish           |          |
| ptBR        | Portuguese-Brazil|          |
| ro          | Romanian         |          |
| ru          | Russian          |          |
| sk          | Slovak           |          |
| slSI        | Slovenian        |          |
| sv          | Swedish          |          |
| sr          | Serbian (Latin)  |          |
| srCyrl      | Serbian (Cyrl)   |          |
| th          | Thai             |          |
| tr          | Turkish          |          |
| uk          | Ukrainian        |          |
| ur          | Urdu             |          |
| vi          | Vietnamese       |          |
| zh          | Chinese          |          |
