export default function (form) {
  for (let key in form) {
    if (!form[key] && form[key] !== 0) {
      return false
    }
  }
  return true
}
