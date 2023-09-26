import SD from '@transmute/vc-jwt-sd'


export const setIssuer = (disclosable: string, id:string)=> {
  const parsed = SD.YAML.parseCustomTags(disclosable)
  const issuer = parsed.get('issuer') as any
  issuer.set('id', id)
  const revised = SD.YAML.dumps(parsed)
  return revised
}