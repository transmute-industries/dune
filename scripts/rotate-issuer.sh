transmute key generate \
--alg ES384 \
--output scripts/private.signing.jwk.json

transmute key export \
--input  scripts/private.signing.jwk.json \
--output scripts/public.verifying.jwk.json

transmute controller create \
--accept 'application/did+ld+json' \
--input  'scripts/public.verifying.jwk.json' \
--output 'app/.well-known/did.json/did.json'