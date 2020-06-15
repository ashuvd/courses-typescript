export type TSsl = {
  key: Buffer,
  cert: Buffer
}
export type TKeys = {
  secret: string,
  expiresIn: number
}
export type TDefaultConfig = {
  port: number,
  host: string,
  mongoUri: string,
  sslKey?: string,
  sslCert?: string,
  ssl?: TSsl,
  keys: TKeys
}
