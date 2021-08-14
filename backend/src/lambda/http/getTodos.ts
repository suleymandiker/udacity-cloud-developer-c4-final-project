import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserIdFromEvent} from "../../auth/utils";
import {TodoAccess} from "../../utils/TodoAccess";

const todoAccess = new TodoAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserIdFromEvent(event);

    const todos = await todoAccess.getTodos(userId);

    // Send results
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: todos
        })
    }
};
