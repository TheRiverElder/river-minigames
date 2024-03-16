export interface Displayable<TModel = any> {
    getDisplayedModel(): TModel;
}

export function mapModel<TModel = any> (raw: Displayable<TModel>): TModel {
    return raw.getDisplayedModel();
} 