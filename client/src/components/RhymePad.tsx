import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RhymePadEntry, useRhymePad } from "@/hooks/use-rhymepad";
import { format } from "date-fns";

export default function RhymePad() {
  const { entries, addEntry, deleteEntry, toggleFavorite } = useRhymePad();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: "",
    tags: "",
    isFavorite: false
  });

  const handleAddEntry = () => {
    if (!newEntry.content.trim()) {
      toast({
        title: "Entry cannot be empty",
        description: "Please add some content to your entry",
        variant: "destructive"
      });
      return;
    }

    const tagsArray = newEntry.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const entry = {
      content: newEntry.content,
      tags: tagsArray,
      addedFrom: 'manual' as const,
      isFavorite: newEntry.isFavorite
    };

    addEntry(entry);
    
    toast({
      title: "Added to your Flow Vault!",
      description: "Your flow has been saved",
    });

    // Reset form and close modal
    setNewEntry({
      content: "",
      tags: "",
      isFavorite: false
    });
    setIsAddModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Unknown date";
    }
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Entry deleted",
      description: "Your flow has been removed from the vault",
    });
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 max-w-3xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold gradient-text">My Flow Vault</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Your Flow Vault</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={5}
                  placeholder="Type your flow, rhyme, or phrase here..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="filler, 2-syllable, opener"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="favorite"
                  checked={newEntry.isFavorite}
                  onCheckedChange={(checked) => setNewEntry({ ...newEntry, isFavorite: checked })}
                />
                <Label htmlFor="favorite">Mark as favorite</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" onClick={handleAddEntry}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Your Flow Vault is Empty</h2>
            <p className="text-muted-foreground mb-4">
              Add your favorite phrases, rhymes, and flows to build your personal collection.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              Add Your First Entry
            </Button>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4 border-2 hover:border-secondary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="font-medium">
                  <div className="flex items-center gap-2">
                    {entry.addedFrom === 'lesson' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        From Lesson
                      </Badge>
                    )}
                    {entry.addedFrom === 'freestyle' && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        From Freestyle
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.dateCreated)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(entry.id)}
                    className={`p-1 rounded-full transition-colors ${
                      entry.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={entry.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-lg mb-3 whitespace-pre-line">{entry.content}</p>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}