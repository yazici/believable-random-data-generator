

// returns a sequence of integers, misses some if density < 100
const integers = (start, length, density=100) => {
  for (var arr = [], num = start;  arr.length < length;  num++) {
    if (rnd(density,'%'))  arr.push(num) }
  return arr
}


// makes an array by using the given function,
const makeArr = (length, func, distinct, persist) => {
  if (distinct) {
    const max = persist? Infinity : 100000
    for (var set = new Set(), i = 0;  set.size < length && i < max;  i++)
      i = (set.size < set.add(func()).size)? 0 : i
    return Array.from(set)
  }
  return Array(length).fill(0).map(func)
}


// formats numbers like 320000000 look like 320,000,000
const addCommas = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",")


// adds the corresponding letters to the number (useful for dates etc.)
const nth = (num) => {
  num = +num
  if (num > 3  &&  num < 21) return num + 'th'
  switch (num % 10) {
    case 1 :  return  num + 'st'
    case 2 :  return  num + 'nd'
    case 3 :  return  num + 'rd'
    default:  return  num + 'th'
  }
}


// takes a Date object, returns a string of format "2019-05-13 18:37:59"
const standartDatetime = (date) =>
  new Date( date.getTime() - date.getTimezoneOffset()*60000 )
    .toISOString().replace('T', ' ').slice(0, -5)


// formats datetime string or Date object by preset like "YYYY, DD Month"
const formatDatetime = (datetime, format) => {
  if (datetime instanceof Date)  datetime = standartDatetime(datetime)
  const [YYYY, MM, DD, HH, mm, ss] = datetime.split(/[- :]/)

  return format.replace('YYYY', YYYY).replace('YY', YYYY.slice(2))
    .replace('Month', months[MM-1]).replace('month', monthShorts[MM-1])
    .replace('MM', MM).replace('DDth', nth(DD)).replace('DD', DD)
    .replace('HH', HH).replace('mm', mm).replace('ss', ss)
}


// shorthand for console.table with transformations it may need taken care of
const conTbl = (data) => {
  // in case the data is an object
  if (!Array.isArray(data)  &&  typeof data == 'object') {
    // in case the data is a records object
    if (data.headers && data.rows && Object.keys(data).length==2)
      conTbl(recordsAsArray(data))
    else console.table(data)  // in case data is ready for console.table
  }
  // in case the data is a valid records array
  else if (typeof data[0][0] == 'string' && Array.isArray(data[1][0]))
    console.table(objectifyRecords(data))
  // in case the data is a flat array
  else if (Array.isArray(data) && typeof data[0] != 'object')
    console.table(data)
  // in case the data is a nested rows array without the headers
  else {
    const headers = Array(data[0].length).fill(0).map((_,i)=>`column${i+1}`)
    console.table( objectifyRecords([headers, data]) )
  }
}


// counts distinct array elements and returns an object with stats
const countUnique = (arr) => {
  const obj = {}
  arr.forEach( item =>  obj[item] = 1 + (obj[item] || 0) )
  return obj
}