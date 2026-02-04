import { useState, useEffect } from "react";
import type { AWECharacter } from "@/types/awe";
import { getTier, getDice } from "@/lib/awe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AWE_WORDS = ["Agility", "Wit", "Endurance"] as const;

interface Props {
  characters: AWECharacter[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export function CharacterList({ characters, onSelect, onCreateNew }: Props) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % AWE_WORDS.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          A.W.E. Character Creation
        </h1>
        <p className="text-sm text-muted-foreground font-variant-small-caps tracking-widest min-h-[1.5em]">
          <span
            key={wordIndex}
            className="inline-block animate-[awe-word-in_0.3s_ease-out]"
          >
            {AWE_WORDS[wordIndex]}
          </span>
        </p>
      </header>

      {characters.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No characters yet. Create one to get started.
        </p>
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
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                  {c.photo && (
                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-border overflow-hidden bg-muted/30">
                      <img
                        src={c.photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardHeader className="p-0 pb-1">
                      <span className="text-base sm:text-lg font-semibold leading-tight break-words">
                        {c.name}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-1 p-0 pt-0 text-sm text-muted-foreground">
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
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Button className="w-full min-h-[44px]" size="lg" onClick={onCreateNew}>
        + New character
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Saved locally in this browser.
      </p>
    </div>
  );
}
