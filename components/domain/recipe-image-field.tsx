import { EntityImageField } from './entity-image-field';

export function RecipeImageField({ recipeId, value, onChange }: { recipeId: string; value?: string | null; onChange(path: string): void }) {
  return <EntityImageField entityType="recipe" entityId={recipeId} value={value} onChange={onChange} />;
}
