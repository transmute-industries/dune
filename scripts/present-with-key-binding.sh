#!/bin/bash

# get an issued credential with key binding
# (optional, a credential with confirmation is required when 
# making presentations with key binding)

ISSUED_TOKEN=$(
curl -s http://localhost:3000/internal/issue \
-H 'Content-Type: text/yaml' \
-H 'Accept: application/json' \
--data-binary "@./scripts/issuance-payload.yml" \
| jq -r '.token'
);

# get a challenge token for an audience
# (🌶️ required, enable external holders to demonstrate possession
# without managing the state of nonces )

CHALLENGE_TOKEN=$(
curl -s http://localhost:3000/.well-known/spice-challenge \
-H 'Accept: application/sd-jwt'
);

# derive a credential with key binding 
# (optional, produces a key binding token for an audience, 
# passing a challenge token as the nonce elimintes the need
# for the verifier to keep state )

PRESENTED_TOKEN=$(
curl -s "http://localhost:3000/internal/disclose?audience=https://dune.did.ai&nonce=$CHALLENGE_TOKEN&token=$ISSUED_TOKEN" \
-H 'Content-Type: text/yaml' \
-H 'Accept: application/json' \
--data-binary "@./scripts/disclosure-payload.yml" \
| jq '.token'
);

# verify a credential with key binding
# (optional, internally verify and validate the presented credential )

curl -s "http://localhost:3000/internal/verify" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
--data-binary "{\"audience\": \"https://dune.did.ai\", \"nonce\": \"$CHALLENGE_TOKEN\", \"token\": $PRESENTED_TOKEN}" \
| jq

# submit a credential with key binding to a verifier
# (🌶️ required, enable external verifiers to receive a presentation from a holder with key binding )
curl -s "http://localhost:3000/.well-known/spice-challenge/$CHALLENGE_TOKEN" \
-H 'Content-Type: application/vc+ld+json+sd-jwt' \
-H 'Accept: application/json' \
--data-binary $PRESENTED_TOKEN \
| jq