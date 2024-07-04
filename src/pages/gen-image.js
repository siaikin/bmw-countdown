export async function genImage(textList) {
  const bgUrl = '/shared-image/bg.png'
  const logoUrl = '/shared-image/logo.png'
  const width = 1080
  const height = 1420
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // render bg
  const bg = new Image()
  bg.src = bgUrl
  bg.crossOrigin = 'anonymous'
  await bg.decode()
  ctx.drawImage(bg, 0, 0, width, height, 0, 0, width, height)

  // render logo
  const logo = new Image()
  logo.src = logoUrl
  logo.crossOrigin = 'anonymous'
  await logo.decode()
  const logoWidth = logo.width * 0.7
  const logoHeight = logo.height * 0.7
  ctx.drawImage(logo, width / 2 - logoWidth / 2, 160, logoWidth, logoHeight)

  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, '#e8cfac')
  gradient.addColorStop(0.5, '#a58a66')
  gradient.addColorStop(1, '#c1a583')
  ctx.fillStyle = gradient

  const bigFont = '96px HYHuangKeBangShuW'
  const smallFont = '36px HYHuangKeBangShuW'
  const textWidthList = textList.map((text, index) => {
    if (index % 2 === 0) {
      ctx.font = bigFont
      return ctx.measureText(text).width
    } else {
      ctx.font = smallFont
      return ctx.measureText(text).width * 2
    }
  }, 0)
  const totalTextWidth = textWidthList.reduce((acc, cur) => acc + cur, 0)

  let offsetX = 0
  for (let i = 0; i < textList.length; i++) {
    const text = textList[i]
    ctx.font = i % 2 === 0 ? bigFont : smallFont
    ctx.textBaseline = i % 2 === 0 ? 'alphabetic' : 'bottom'
    const x = width / 2 - totalTextWidth / 2 + offsetX
    const y = 160 + logoHeight + 128
    ctx.fillText(text, x, y)

    offsetX += textWidthList[i]
  }

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png', 1)
  })

  // const img = new Image()
  // img.src = URL.createObjectURL(blob)
  // document.body.appendChild(img)
  // img.style.width = '100%'
  // img.style.position = 'fixed'
  // img.style.top = '0'

  return blob
}
