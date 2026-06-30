interface LumenLogoProps {
  className?: string
}

export function LumenLogo({ className }: LumenLogoProps) {
  const imgClass = className ?? 'lumen-logo-img'
  const logoDark = `${import.meta.env.BASE_URL}lumen-logo.png`
  const logoLight = `${import.meta.env.BASE_URL}lumen-logo-light.png`

  return (
    <>
      <img
        src={logoDark}
        srcSet={`${logoDark} 2x`}
        alt="Lumen AI"
        width={225}
        height={41}
        className={`${imgClass} lumen-logo-dark`}
        decoding="async"
      />
      <img
        src={logoLight}
        srcSet={`${logoLight} 2x`}
        alt="Lumen AI"
        width={225}
        height={41}
        className={`${imgClass} lumen-logo-light`}
        decoding="async"
      />
    </>
  )
}
