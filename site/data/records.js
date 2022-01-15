//The next line of code will filter out all the unwanted data from the object.
let RECORDS = JSON.parse($.getJSON({'url': "data/records.json", 'async': false}).responseText);