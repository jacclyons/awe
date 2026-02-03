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
  onDelete?: (id: string) => void;
}

export function CharacterSheet({
  character,
  onBack,
  onEditPush,
  onDelete,
}: Props) {
  const {
    attributes,
    pushCurrent,
    pushMax,
    pushDescription,
    notes,
    startType,
  } = character;

  return (
    <article className="space-y-6 pb-8">
      <header className="space-y-1 pb-4 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight">
          {character.name}
        </h1>
        <p className="text-sm text-muted-foreground font-variant-small-caps">
          {startType === "vanilla" ? "Vanilla start" : "Push start"}
        </p>
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

      {notes && (
        <section className="space-y-1">
          <h2 className="text-sm font-medium text-muted-foreground font-variant-small-caps tracking-wider">
            Notes
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {notes}
          </p>
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
