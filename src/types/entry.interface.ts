export interface Address {
    country: string;
    city: string;
}

export interface SourceEntity {
    id: number;
    name: string;
    address: Address;
    isAvailable: boolean;
    priceForNight: number;
}

export interface UnifiedEntity {
    source: string;
    data: Record<string, any>;
}
