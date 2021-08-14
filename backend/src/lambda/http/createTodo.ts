import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserIdFromEvent} from "../../auth/utils";
import {TodoAccess} from "../../utils/TodoAccess";

const todoAccess = new TodoAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserIdFromEvent(event);

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const todoId = await todoAccess.createTodo(userId, newTodo);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item:
          {
            todoId: todoId,
            ...newTodo
          }
    })
  };
};
