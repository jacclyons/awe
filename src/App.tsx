import { useState } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { CharacterList } from "@/components/CharacterList";
import { CharacterCreator } from "@/components/CharacterCreator";
import { CharacterSheet } from "@/components/CharacterSheet";
import { PushEditor } from "@/components/PushEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AWECharacter } from "@/types/awe";

type View = "list" | "create" | "view" | "editPush";

function App() {
  const {
    characters,
    loaded,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
  } = useCharacters();
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selected = selectedId ? getCharacter(selectedId) : null;

  const handleSaveNew = (character: AWECharacter) => {
    addCharacter(character);
    setView("list");
    setSelectedId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView("view");
  };

  const handleBack = () => {
    setView("list");
    setSelectedId(null);
  };

  const handleSavePush = (character: AWECharacter) => {
    updateCharacter(character.id, {
      pushCurrent: character.pushCurrent,
      pushDescription: character.pushDescription,
    });
    setView("view");
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteCharacter(deleteTargetId);
      setView("list");
      setSelectedId(null);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <main className="max-w-[520px] mx-auto sm:max-w-[560px]">
        {view === "list" && (
          <CharacterList
            characters={characters}
            onSelect={handleSelect}
            onCreateNew={() => setView("create")}
          />
        )}
        {view === "create" && (
          <CharacterCreator
            onSave={handleSaveNew}
            onCancel={handleBack}
          />
        )}
        {view === "view" && selected && (
          <CharacterSheet
            character={selected}
            onBack={handleBack}
            onEditPush={() => setView("editPush")}
            onDelete={handleDeleteClick}
          />
        )}
        {view === "editPush" && selected && (
          <PushEditor
            character={selected}
            onSave={handleSavePush}
            onCancel={() => setView("view")}
          />
        )}
      </main>

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete character?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
