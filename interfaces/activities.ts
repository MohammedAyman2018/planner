import type { ICategory } from "./categories";

export interface IActivity {
    label: string;
    category_id: ICategory;
    _id?: string;
    createdAt?: Date;
}