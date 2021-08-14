// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '16x1yxz73c'
const region = 'us-east-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-u0ppusw8.us.auth0.com',            // Auth0 domain
  clientId: 'XovhlQK4WvTttrMcOOFH9xpNiBhUvRtA',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/'
}
