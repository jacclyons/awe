import type { AWECharacter } from "@/types/awe";
import { getTier, getDice } from "@/lib/awe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  characters: AWECharacter[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export function CharacterList({ characters, onSelect, onCreateNew }: Props) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          A.W.E. Characters
        </h1>
        <p className="text-sm text-muted-foreground font-variant-small-caps tracking-widest">
          Agility · Wit · Endurance
        </p>
        <Button className="w-full" size="lg" onClick={onCreateNew}>
          + New character
        </Button>
      </header>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
          <p>No characters yet. Create one to get started.</p>
          <Button onClick={onCreateNew}>Create first character</Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {characters.map((c) => (
            <li key={c.id}>
              <Card
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => onSelect(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(c.id);
                  }
                }}
              >
                <CardHeader className="pb-1">
                  <span className="text-lg font-semibold leading-tight">
                    {c.name}
                  </span>
                </CardHeader>
                <CardContent className="space-y-1 pt-0 text-sm text-muted-foreground">
                  <span>
                    A{c.attributes.agility} W{c.attributes.wit} E
                    {c.attributes.endurance} · {getTier(c.attributes.agility)} /{" "}
                    {getTier(c.attributes.wit)} / {getTier(c.attributes.endurance)}
                  </span>
                  <span className="block font-mono text-xs opacity-90">
                    {getDice(c.attributes.agility)}/{getDice(c.attributes.wit)}/
                    {getDice(c.attributes.endurance)} dice · Push {c.pushCurrent}/
                    {c.pushMax}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Saved locally in this browser.
      </p>
    </div>
  );
}
