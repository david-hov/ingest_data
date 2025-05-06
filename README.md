# Data Ingestion

This project is a **Data Ingestion Service** built using **NestJS**, **MongoDB** with **Mongoose**, and a **cron job** that ingests data from external sources (e.g. S3 buckets). The service provides a unified API with filtering capabilities, allowing users to retrieve ingested data with various parameters such as source, price, availability, city, country, name.

## Features
- **Ingestion of JSON data**: The service periodically(every 15 minutes) ingests large datasets from external sources (S3).
- **Filtering**: Supports advanced filtering across multiple attributes like `name`, `city`, `price`, and `availability`.
- **Pagination**: Provides pagination support with limit and page number parameters.
- **Cron jobs**: Automatically ingests data on a schedule (every 15 minutes).

### Ingestion Service Initialization

To ensure data is retrieved initially and refreshed periodically, the **IngestionService** is set up to perform the following actions:

1. **Initial Data Retrieval**: (***OnModuleInit***)  Data is retrieved and populated into the system when the application starts.

2. **Scheduled Data Refresh**: A background process is set up to re-fetch the data every **15 minutes** to keep the system up to date with the latest information.

This process is implemented using the `@Cron` decorator to run the data retrieval task at specified intervals.


## MongoDB Indexing Strategy
To optimize queries on the `data` object, we have created indexes on specific fields within it. Below are the indexed fields for the `data` object:

```ts
@Prop({ index: true, required: true })
source: string;
    
@Prop({ index: true, required: true })
'data.name': string;

@Prop({ index: true, required: true })
'data.address.country': string;

@Prop({ index: true, required: true })
'data.address.city': string;
```
## Technologies Used
- **NestJS**
- **MongoDB**
- **Mongoose**
- **TypeScript**
- **Cron Jobs**
- **Postman**

## API Endpoints

### **GET** /ingested_data

This endpoint retrieves ingested data based on filters, pagination, and limit.

#### Request Example: 
http://localhost:3001/ingested_data
```http
http://localhost:3001/ingested_data?filters={"name":"Countryside Cottage", "country": "Japan", "minPrice": 500, "isAvailable": false}&limit=10&page=1
```
The API will return a JSON response with the following structure:

```json
{
    "message": "Request was successful",
    "data": {
        "result": [
            {
                "_id": "681a449d10463cd235717b02",
                "source": "source1",
                "data": {
                    "id": 923322,
                    "name": "Countryside Cottage",
                    "address": {
                        "country": "Japan",
                        "city": "Tokyo"
                    },
                    "isAvailable": false,
                    "priceForNight": 637
                },
                "__v": 0
            },
            {
                "_id": "681a449d10463cd235717b98",
                "source": "source1",
                "data": {
                    "id": 271145,
                    "name": "Countryside Cottage",
                    "address": {
                        "country": "Japan",
                        "city": "Osaka"
                    },
                    "isAvailable": false,
                    "priceForNight": 582
                },
                "__v": 0
            },
            {
                "_id": "681a449d10463cd235717c9a",
                "source": "source1",
                "data": {
                    "id": 335616,
                    "name": "Countryside Cottage",
                    "address": {
                        "country": "Japan",
                        "city": "Kyoto"
                    },
                    "isAvailable": false,
                    "priceForNight": 711
                },
                "__v": 0
            }
        ],
        "total": 3
    }
}
```


## Project Installation

To ensure the correct Node.js version, this project uses an `.nvmrc` file. If you are using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), you can run the following command to automatically use the appropriate version:

Follow these steps to set up the project:

1. Copy the example environment file and create your `.env`:

   ```sh
   cp .env.example .env
2. Set env variables in .env file:
    ```sh
    DATABASE_HOST=
    DATABASE_PORT=
    DATABASE_NAME=
    SOURCE1_URL=
    ```
Install the dependencies:

```sh
npm i
```
Start the development server:

```sh
npm run start:dev
```

# Dockerfile and Docker Compose Environment Variables Setup

In `docker-compose.yml`, ensure that the environment variables are set for use in your application:

```Dockerfile
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
SOURCE1_URL=
```
