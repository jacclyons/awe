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
      <div className="flex justify-start mb-2">
        <Button type="button" variant="outline" size="sm" onClick={onBack} className="min-h-[44px] w-full sm:w-auto touch-manipulation">
          ← Back to list
        </Button>
      </div>
      <header className="flex flex-row gap-3 sm:gap-4 pb-4 border-b border-border">
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
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
            className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 active:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[3.5rem] min-h-[3.5rem] touch-manipulation"
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
          <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
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
              className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-2 sm:gap-3 items-center py-3 border-b border-border last:border-0 text-sm min-h-[44px]"
            >
              <span className="font-medium truncate">{LABELS[key]}</span>
              <span className="font-mono font-medium text-primary">
                {attributes[key]}
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm truncate max-w-[4.5rem] sm:max-w-none">
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

      {onDelete && (
        <footer className="pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(character.id)}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Delete Character
          </Button>
        </footer>
      )}
    </article>
  );
}
