# dump collection to a json file
mongoexport --db=derecksnotes --collection=articles_metadata --out=articles_metadata.json

mongoexport --db=derecksnotes --collection=dictionary_definitions --out=dictionary_definitions.json