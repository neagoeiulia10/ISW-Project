export interface TripNote{
    id:number;
    place: string;
    dateFrom: Date;
    dateTo: Date;
    description: string;
    imageUrl:string
    rating: number;
    isEditing?: boolean;
}