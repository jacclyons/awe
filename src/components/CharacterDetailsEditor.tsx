import { useState, useRef } from "react";
import type { AWECharacter } from "@/types/awe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DETAIL_FIELDS = [
  { key: "traits" as const, label: "Personality traits", placeholder: "e.g. Curious, quick to laugh" },
  { key: "ideals" as const, label: "Ideals", placeholder: "e.g. Justice, freedom, loyalty" },
  { key: "bonds" as const, label: "Bonds", placeholder: "e.g. Sworn to protect a sibling" },
  { key: "flaws" as const, label: "Flaws", placeholder: "e.g. Trusts others too easily" },
] as const;

interface Props {
  character: AWECharacter;
  onSave: (character: AWECharacter) => void;
  onCancel: () => void;
}

export function CharacterDetailsEditor({ character, onSave, onCancel }: Props) {
  const [name, setName] = useState(character.name);
  const [photo, setPhoto] = useState(character.photo ?? "");
  const [traits, setTraits] = useState(character.traits ?? "");
  const [ideals, setIdeals] = useState(character.ideals ?? "");
  const [bonds, setBonds] = useState(character.bonds ?? "");
  const [flaws, setFlaws] = useState(character.flaws ?? "");
  const [notes, setNotes] = useState(character.notes ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...character,
      name: name.trim(),
      photo: photo || undefined,
      traits: traits.trim() || undefined,
      ideals: ideals.trim() || undefined,
      bonds: bonds.trim() || undefined,
      flaws: flaws.trim() || undefined,
      notes: notes.trim() || undefined,
      updatedAt: Date.now(),
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold tracking-tight">
        Edit character details
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
        <div className="flex-1 space-y-2 min-w-0">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name"
          />
        </div>
        <div className="shrink-0 space-y-2">
          <Label>Photo</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className="w-24 h-24 min-w-[6rem] min-h-[6rem] rounded-lg border border-border bg-muted/30 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 active:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring self-start touch-manipulation"
          >
            {photo ? (
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">
                Add photo
              </span>
            )}
          </div>
          {photo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => setPhoto("")}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {DETAIL_FIELDS.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Textarea
            id={key}
            value={
              key === "traits"
                ? traits
                : key === "ideals"
                  ? ideals
                  : key === "bonds"
                    ? bonds
                    : flaws
            }
            onChange={(e) => {
              const v = e.target.value;
              if (key === "traits") setTraits(v);
              else if (key === "ideals") setIdeals(v);
              else if (key === "bonds") setBonds(v);
              else setFlaws(v);
            }}
            placeholder={placeholder}
            rows={2}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Background, equipment, etc."
          rows={3}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto min-h-[44px]">Save</Button>
      </div>
    </form>
  );
}
