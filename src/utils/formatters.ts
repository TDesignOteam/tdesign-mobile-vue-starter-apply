export function formatPrice(minPrice: number, maxPrice: number): string {
  if (minPrice === 0 && maxPrice === 0)
    return '免费活动'
  if (minPrice === maxPrice)
    return `¥${minPrice.toFixed(2)}`
  return `¥${minPrice.toFixed(2)}-¥${maxPrice.toFixed(2)}`
}

export function formatCityName(name: string) {
  if (name.endsWith('市'))
    return name.slice(0, -1)
  return name
}
