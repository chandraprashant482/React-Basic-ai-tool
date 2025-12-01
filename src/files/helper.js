export function checkHeading(str) {
  return /^\*\*(.*)$/.test(str)
}


export function replaceHeadingStar(str) {
  return str.replace(/^\*\*|\*\*$/g, '')
}
