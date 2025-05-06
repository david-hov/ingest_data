import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UnifiedEntity } from '../types/entry.interface';
import { IngestedDocument } from './schemas/ingestion.schema';

@Injectable()
export class IngestionService implements OnModuleInit {
    private readonly logger = new Logger(IngestionService.name);

    constructor(
        @InjectModel('ingested')
        private readonly ingestedDocumentModel: Model<IngestedDocument>
    ) { }

    async onModuleInit() {
        await this.ingestData();
    }

    @Cron('0 */15 * * * *')
    async ingestData() {
        const sources = [
            { url: process.env.SOURCE1_URL, source: 'source1' },
        ];

        const allDocs: UnifiedEntity[] = [];

        for (const { url, source } of sources) {
            if (url && source) {
                try {
                    const response = await fetch(url);
                    const result = await response.json();
                    const docs = result.map((entry) => ({
                        source,
                        data: entry,
                    }));
                    allDocs.push(...docs);
                } catch (err) {
                    this.logger.error(`Failed to fetch from ${url}: ${err.message}`);
                }
            } else {
                this.logger.log('URL/Source not provided');
            }
        }

        if (allDocs.length > 0) {
            try {
                await this.ingestedDocumentModel.insertMany(allDocs, { ordered: false });
                this.logger.log('Data inserted into DB');
            } catch (err) {
                this.logger.error(`Insert failed: ${err.message}`);
            }
        }
    }

    async findAll(filters: any, limit: string, page: string) {
        const query: any = {};
        const parsedFilters = filters ? JSON.parse(filters) : {};
        if (parsedFilters.source) {
            query.source = parsedFilters.source;
        }
        if (parsedFilters.name) {
            query['data.name'] = { $regex: parsedFilters.name, $options: 'i' };
        }
        if (parsedFilters.country) {
            query['data.address.country'] = { $regex: parsedFilters.country, $options: 'i' };
        }
        if (parsedFilters.city) {
            query['data.address.city'] = { $regex: parsedFilters.city, $options: 'i' };
        }
        if (parsedFilters.isAvailable !== undefined) {
            query['data.isAvailable'] = parsedFilters.isAvailable === 'true';
        }
        if (parsedFilters.minPrice || parsedFilters.maxPrice) {
            query['data.priceForNight'] = {};
            if (parsedFilters.minPrice) {
                query['data.priceForNight'].$gte = Number(parsedFilters.minPrice);
            }
            if (parsedFilters.maxPrice) {
                query['data.priceForNight'].$lte = Number(parsedFilters.maxPrice);
            }
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 20;
        const skip = (pageNumber - 1) * limitNumber;

        try {
            const [list, count] = await Promise.all([
                this.ingestedDocumentModel.find(query).skip(skip).limit(limitNumber).lean(),
                this.ingestedDocumentModel.countDocuments(query),
            ]);
            return { data: list, count: count };
        } catch (error) {
            throw new Error('Error while fetching data');
        }
    }
}
