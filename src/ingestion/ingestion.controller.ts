import { Controller, Get, Logger, HttpException, Query, HttpStatus } from '@nestjs/common';

import { IngestionService } from './ingestion.service';

@Controller('ingested_data')
export class IngestionController {
    private readonly logger = new Logger(IngestionController.name);
    constructor(
        private readonly ingestionService: IngestionService
    ) { }

    @Get()
    async find(
        @Query('filters') filters: string,
        @Query('limit') limit: string,
        @Query('page') page: string,
    ) {
        this.logger.debug('GET/ingested_data/ - get all data');
        try {
            const { data, count } = await this.ingestionService.findAll(filters, limit, page);
            return {
                message: 'Request was successful',
                data: {
                    result: data,
                    total: count
                },
            };
        } catch (error) {
            throw new HttpException({
                message: 'Error occurred while fetching data.',
                error: error.message || 'Unknown error',
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
