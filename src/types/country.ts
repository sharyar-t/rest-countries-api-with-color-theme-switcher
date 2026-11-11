export interface Currency {
  code: string
  name: string
  symbol: string
}

export interface Language {
  iso639_1?: string
  iso639_2: string
  name: string
  nativeName?: string
}

export interface Country {
  alpha3Code: string
  name: string
  nativeName: string
  region: string
  subregion: string
  capital?: string
  topLevelDomain: string[]
  population: number
  flags: { svg: string; png: string }
  currencies?: Currency[]
  languages: Language[]
  borders?: string[]
}
