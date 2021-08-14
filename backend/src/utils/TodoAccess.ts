import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {TodoItem} from "../models/TodoItem";
import * as uuid from 'uuid'
import { createLogger } from './logger'
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
const logger = createLogger('todoAccess');

const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOITEM_TABLE,
        private readonly todoTableGsi = process.env.TODOITEM_TABLE_GSI ) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Fetching all todos for userId', {userId: userId})

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoTableGsi,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = result.Items

        logger.info("Fetching complete.", items)

        return items as TodoItem[]
    }

    async createTodo(userId: string, newTodo: CreateTodoRequest): Promise<string> {
        const todoId = uuid.v4();

        const newTodoWithAdditionalInfo = {
            userId: userId,
            todoId: todoId,
            ...newTodo
        }

        logger.info("Creating new todo object:", newTodoWithAdditionalInfo);

        await this.docClient.put({
            TableName: this.todoTable,
            Item: newTodoWithAdditionalInfo
        }).promise();

        logger.info("Create complete.")

        return todoId;

    }

    async deleteTodo(todoId: string) {
        logger.info("Deleting todo:", {todoId: todoId});
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            }
        }).promise();
        logger.info("Delete complete.", {todoId: todoId});
    }

    async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest){

        logger.info("Updating todo:", {
            todoId: todoId,
            updatedTodo: updatedTodo
        });
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            },
            UpdateExpression: "set #todoName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ":name": updatedTodo.name,
                ":done": updatedTodo.done,
                ":dueDate": updatedTodo.dueDate
            }
        }).promise()

        logger.info("Update complete.")

    }

    async updateTodoAttachmentUrl(todoId: string, attachmentUrl: string){

        logger.info(`Updating todoId ${todoId} with attachmentUrl ${attachmentUrl}`)

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentUrl}`
            }
        }).promise();
    }

}
