# See also https://github.com/transmute-industries/transmute/tree/main/examples

transmute key generate \
--alg ES384 \
--output scripts/private.signing.jwk.json

transmute key export \
--input  scripts/private.signing.jwk.json \
--output scripts/public.verifying.jwk.json

transmute controller create \
--accept 'application/did+ld+json' \
--id     'did:web:dune.did.ai' \
--input  'scripts/public.verifying.jwk.json' \
--output 'app/.well-known/did.json/did.json'


echo "PRIVATE_KEY_JWK=$(jq -r tostring scripts/private.signing.jwk.json)" > .env

vercel env rm PRIVATE_KEY_JWK production -y
vercel env add PRIVATE_KEY_JWK production < scripts/private.signing.jwk.json