interface LumenLogoProps {
  className?: string
}

export function LumenLogo({ className }: LumenLogoProps) {
  const imgClass = className ?? 'lumen-logo-img'

  return (
    <>
      <img
        src="/lumen-logo.png"
        srcSet="/lumen-logo.png 2x"
        alt="Lumen AI"
        width={225}
        height={41}
        className={`${imgClass} lumen-logo-dark`}
        decoding="async"
      />
      <img
        src="/lumen-logo-light.png"
        srcSet="/lumen-logo-light.png 2x"
        alt="Lumen AI"
        width={225}
        height={41}
        className={`${imgClass} lumen-logo-light`}
        decoding="async"
      />
    </>
  )
}
