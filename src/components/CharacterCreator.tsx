import { useState } from "react";
import type { AWECharacter, AWEAttributes, StartType } from "@/types/awe";
import {
  VANILLA_POINTS,
  VANILLA_PUSH,
  PUSH_START_POINTS,
  PUSH_START_PUSH,
  MIN_ATTR,
  MAX_ATTR,
} from "@/types/awe";
import { getTier, getDice, getTolerance } from "@/lib/awe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ATTRIBUTES: (keyof AWEAttributes)[] = ["agility", "wit", "endurance"];
const LABELS: Record<keyof AWEAttributes, string> = {
  agility: "Agility",
  wit: "Wit",
  endurance: "Endurance",
};

function generateId(): string {
  return `awe-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface Props {
  onSave: (character: AWECharacter) => void;
  onCancel: () => void;
}

export function CharacterCreator({ onSave, onCancel }: Props) {
  const [name, setName] = useState("");
  const [startType, setStartType] = useState<StartType>("vanilla");
  const [attributes, setAttributes] = useState<AWEAttributes>({
    agility: 0,
    wit: 0,
    endurance: 0,
  });
  const [pushDescription, setPushDescription] = useState("");
  const [notes, setNotes] = useState("");

  const pointsPool =
    startType === "vanilla" ? VANILLA_POINTS : PUSH_START_POINTS;
  const pushMax = startType === "vanilla" ? VANILLA_PUSH : PUSH_START_PUSH;
  const used =
    attributes.agility + attributes.wit + attributes.endurance;
  const pointsLeft = pointsPool - used;
  const meetsMinimum =
    attributes.agility >= MIN_ATTR &&
    attributes.wit >= MIN_ATTR &&
    attributes.endurance >= MIN_ATTR;
  const valid =
    name.trim() !== "" && pointsLeft >= 0 && meetsMinimum;

  function setAttr(key: keyof AWEAttributes, value: number) {
    const n = Math.max(0, Math.min(MAX_ATTR, value));
    setAttributes((prev) => ({ ...prev, [key]: n }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const now = Date.now();
    const character: AWECharacter = {
      id: generateId(),
      name: name.trim(),
      startType,
      attributes: { ...attributes },
      pushCurrent: pushMax,
      pushMax,
      pushDescription: pushDescription.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    onSave(character);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold tracking-tight">New character</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Character name"
          autoFocus
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Label className="text-muted-foreground">Start type</Label>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup
            value={startType}
            onValueChange={(v) => setStartType(v as StartType)}
            className="flex flex-col gap-3"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="vanilla" />
              <span>
                Vanilla — {VANILLA_POINTS} points, {VANILLA_PUSH} Push
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="push" />
              <span>
                Push start — {PUSH_START_POINTS} points, {PUSH_START_PUSH} Push
              </span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Label className="text-muted-foreground">
            Attributes (0–10, min 1 to save) — {pointsLeft} point
            {pointsLeft !== 1 ? "s" : ""} left
          </Label>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {ATTRIBUTES.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <Label className="flex flex-col gap-0.5 font-normal">
                {LABELS[key]}
                <span className="text-xs text-muted-foreground font-normal">
                  {getTier(attributes[key])} · {getDice(attributes[key])} dice
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAttr(key, attributes[key] - 1)}
                  disabled={attributes[key] <= 0}
                  aria-label={`Decrease ${LABELS[key]}`}
                >
                  −
                </Button>
                <span className="font-mono font-medium min-w-[1.5rem] text-center">
                  {attributes[key]}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAttr(key, attributes[key] + 1)}
                  disabled={attributes[key] >= MAX_ATTR || pointsLeft <= 0}
                  aria-label={`Increase ${LABELS[key]}`}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground pt-1">
            Endurance {attributes.endurance} → Tolerance{" "}
            {getTolerance(attributes.endurance)} (Major Wounds before
            incapacitated)
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="push-desc">
          Push usage{" "}
          <span className="text-muted-foreground font-normal">
            (discuss with GM)
          </span>
        </Label>
        <Textarea
          id="push-desc"
          value={pushDescription}
          onChange={(e) => setPushDescription(e.target.value)}
          placeholder="How does your character use Push? e.g. reroll, negate wound, special ability…"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Background, equipment, etc."
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!valid && (
          <p className="text-sm text-muted-foreground order-last sm:order-first">
            {!name.trim()
              ? "Enter a name to save."
              : pointsLeft < 0
                ? `You've overspent by ${-pointsLeft} point${-pointsLeft !== 1 ? "s" : ""}. Reduce attributes.`
                : !meetsMinimum
                  ? "Each attribute must be at least 1 to save."
                  : null}
          </p>
        )}
        <div className="flex gap-3 justify-end sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!valid}>
            Save character
          </Button>
        </div>
      </div>
    </form>
  );
}
