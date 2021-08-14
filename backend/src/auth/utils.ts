import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import {APIGatewayProxyEvent} from "aws-lambda";

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export function getUserIdFromEvent(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  return parseUserId(jwtToken);
}
