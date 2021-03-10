// ref: https://stackoverflow.com/questions/20988446/regex-for-mongodb-objectid
export const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
// ref: https://rgxdb.com/r/1NUN74O6
export const BASE_64_REGEX = /^(?:[a-zA-Z0-9+\/]{4})*(?:|(?:[a-zA-Z0-9+\/]{3}=)|(?:[a-zA-Z0-9+\/]{2}==)|(?:[a-zA-Z0-9+\/]{1}===))$/;
// ref: https://stackoverflow.com/questions/13283470/regex-for-allowing-alphanumeric-and-space
export const NAME_REGEX = /^[a-zA-Z0-9\d\-_\s]+$/i;
// ref: https://stackoverflow.com/questions/14639378/regex-to-validate-only-alphanumeric-no-spaces-and-only-40-characters
export const LABEL_REGEX = /^[a-zA-Z0-9\-_]{0,40}$/;
