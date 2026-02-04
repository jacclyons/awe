import { useState } from "react";
import type { AWECharacter } from "@/types/awe";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  character: AWECharacter;
  onSave: (character: AWECharacter) => void;
  onCancel: () => void;
}

export function PushEditor({ character, onSave, onCancel }: Props) {
  const [pushCurrent, setPushCurrent] = useState(character.pushCurrent);
  const [pushDescription, setPushDescription] = useState(
    character.pushDescription ?? ""
  );
  const max = character.pushMax;

  const handleSave = () => {
    onSave({
      ...character,
      pushCurrent,
      pushDescription: pushDescription.trim() || undefined,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="space-y-6 py-2">
      <h2 className="text-xl font-semibold tracking-tight">
        Edit Push — {character.name}
      </h2>

      <div className="space-y-2">
        <Label>Current Push</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0"
            onClick={() => setPushCurrent((p) => Math.max(0, p - 1))}
            disabled={pushCurrent <= 0}
          >
            −
          </Button>
          <span className="font-mono text-lg min-w-[4ch] text-center">
            {pushCurrent} / {max}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0"
            onClick={() => setPushCurrent((p) => Math.min(max, p + 1))}
            disabled={pushCurrent >= max}
          >
            +
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="push-usage">Push usage (GM-defined)</Label>
        <Textarea
          id="push-usage"
          value={pushDescription}
          onChange={(e) => setPushDescription(e.target.value)}
          placeholder="How your character uses Push…"
          rows={3}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} className="w-full sm:w-auto min-h-[44px]">
          Save
        </Button>
      </div>
    </div>
  );
}
