export interface Displayable<TModel = any> {
    getDisplayedModel(): TModel;
}

export const mapModel = <TModel = any>(raw: Displayable<TModel>) => raw.getDisplayedModel();