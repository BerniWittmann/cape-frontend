export function convertHexToRgba(color, opacity = 1) {
  const c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return `rgba(${parseInt(c[1], 16)}, ${parseInt(c[2], 16)}, ${parseInt(c[3], 16)}, ${opacity})`
}
