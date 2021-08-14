import jwcrypto

with open('keypair.pem','rb') as pemfile:
     key = jwk.JWK.from_pem(pemfile.read())

print(key)