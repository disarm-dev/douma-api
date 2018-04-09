const path_to_array = path => path.split('/')
    .filter(s => s.length)
    .filter(s => !s.startsWith(':'))

const array_to_path = array => array.length ?
    array.reduce((acc, el) => `${acc}/${el}`, '')
    : '/'
/*
Need a method to take a url such as /config/:config_id
and return /config
 */
const url_base = url => array_to_path(path_to_array(url))

module.exports = {
    url_base
}