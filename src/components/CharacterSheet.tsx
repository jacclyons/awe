import type { AWECharacter } from "@/types/awe";
import { getTier, getDice, getTolerance } from "@/lib/awe";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LABELS: Record<keyof AWECharacter["attributes"], string> = {
  agility: "Agility",
  wit: "Wit",
  endurance: "Endurance",
};

interface Props {
  character: AWECharacter;
  onBack: () => void;
  onEditPush?: (character: AWECharacter) => void;
  onEditDetails?: (character: AWECharacter) => void;
  onDelete?: (id: string) => void;
}

const DETAIL_FIELDS = [
  { key: "traits" as const, label: "Personality traits" },
  { key: "ideals" as const, label: "Ideals" },
  { key: "bonds" as const, label: "Bonds" },
  { key: "flaws" as const, label: "Flaws" },
] as const;

export function CharacterSheet({
  character,
  onBack,
  onEditPush,
  onEditDetails,
  onDelete,
}: Props) {
  const {
    attributes,
    pushCurrent,
    pushMax,
    pushDescription,
    photo,
    traits,
    ideals,
    bonds,
    flaws,
    notes,
    startType,
  } = character;

  const hasDetails =
    traits || ideals || bonds || flaws || notes;

  return (
    <article className="space-y-6 pb-8">
      <header className="flex flex-row gap-4 pb-4 border-b border-border">
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {character.name}
          </h1>
          <p className="text-sm text-muted-foreground font-variant-small-caps">
            {startType === "vanilla" ? "Vanilla start" : "Push start"}
          </p>
        </div>
        {onEditDetails ? (
          <button
            type="button"
            onClick={() => onEditDetails(character)}
            className="shrink-0 w-20 h-20 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {photo ? (
              <img
                src={photo}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">
                Add photo
              </span>
            )}
          </button>
        ) : (
          <div className="shrink-0 w-20 h-20 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">
                Add photo
              </span>
            )}
          </div>
        )}
      </header>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground font-variant-small-caps tracking-wider">
          Attributes
        </h2>
        <ul className="space-y-0">
          {(["agility", "wit", "endurance"] as const).map((key) => (
            <li
              key={key}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-2 border-b border-border last:border-0 text-sm"
            >
              <span className="font-medium">{LABELS[key]}</span>
              <span className="font-mono font-medium text-primary">
                {attributes[key]}
              </span>
              <span className="text-muted-foreground">
                {getTier(attributes[key])}
              </span>
              <span className="font-mono text-muted-foreground text-xs">
                {getDice(attributes[key])} dice
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground font-variant-small-caps tracking-wider">
          Endurance
        </h2>
        <p className="text-sm">
          <strong>Tolerance:</strong> {getTolerance(attributes.endurance)} Major
          Wound{getTolerance(attributes.endurance) !== 1 ? "s" : ""} before
          incapacitated
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground font-variant-small-caps tracking-wider">
          Push
        </h2>
        <p className="font-mono text-lg">
          <span className="text-primary">{pushCurrent}</span>
          <span className="text-muted-foreground"> / </span>
          <span>{pushMax}</span>
        </p>
        {pushDescription && (
          <p className="text-sm text-muted-foreground italic">
            {pushDescription}
          </p>
        )}
        {onEditPush && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onEditPush(character)}
          >
            Edit Push / spend
          </Button>
        )}
      </section>

      {(hasDetails || onEditDetails) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground font-variant-small-caps tracking-wider">
              Character details
            </h2>
            {onEditDetails && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onEditDetails(character)}
              >
                Edit
              </Button>
            )}
          </div>
          <div className="space-y-3 text-sm">
            {DETAIL_FIELDS.map(({ key, label }) => {
              const value = character[key];
              if (!value) return null;
              return (
                <div key={key}>
                  <p className="font-medium text-muted-foreground mb-0.5">
                    {label}
                  </p>
                  <p className="whitespace-pre-wrap">{value}</p>
                </div>
              );
            })}
            {notes && (
              <div>
                <p className="font-medium text-muted-foreground mb-0.5">
                  Notes
                </p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {notes}
                </p>
              </div>
            )}
            {!hasDetails && onEditDetails && (
              <p className="text-muted-foreground italic">
                Add traits, ideals, bonds, flaws, and notes to flesh out your
                character.
              </p>
            )}
          </div>
        </section>
      )}

      <Separator />

      <footer className="flex flex-wrap gap-3 justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back to list
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(character.id)}
          >
            Delete Character
          </Button>
        )}
      </footer>
    </article>
  );
}
