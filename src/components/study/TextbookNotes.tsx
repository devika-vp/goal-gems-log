import { useState } from 'react';
import { TextbookReference, Subject } from '@/types/study';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, BookText, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface TextbookNotesProps {
  references: TextbookReference[];
  subjects: Subject[];
  onAddReference: (subject: string, title: string, author: string, pages: string, notes: string) => void;
  onDeleteReference: (id: string) => void;
}

export function TextbookNotes({ 
  references, 
  subjects, 
  onAddReference, 
  onDeleteReference 
}: TextbookNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [notes, setNotes] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  const handleAdd = () => {
    if (!subject.trim() || !title.trim()) return;
    onAddReference(subject, title, author, pages, notes);
    setSubject('');
    setTitle('');
    setAuthor('');
    setPages('');
    setNotes('');
    setIsAdding(false);
  };

  const filteredReferences = filterSubject === 'all' 
    ? references 
    : references.filter(r => r.subject === filterSubject);

  const getSubjectColor = (subjectName: string) => {
    const subj = subjects.find(s => s.name === subjectName);
    return subj?.color || 'hsl(var(--muted))';
  };

  return (
    <div className="space-y-4">
      {/* Filter by Subject */}
      <div className="flex items-center gap-2">
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(s => (
              <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filteredReferences.length} reference{filteredReferences.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add New Reference Form */}
      {isAdding ? (
        <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Subject *" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Book Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="h-9"
            />
            <Input
              placeholder="Pages (e.g., 45-60)"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="h-9"
            />
          </div>
          <Textarea
            placeholder="Notes (key concepts, summaries, formulas...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!subject || !title}>
              <Plus className="w-4 h-4 mr-1" />
              Save Reference
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full border-dashed"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Textbook Reference
        </Button>
      )}

      {/* References List */}
      <ScrollArea className="h-[350px]">
        <div className="space-y-2 pr-3">
          {filteredReferences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No references yet</p>
              <p className="text-xs">Add textbook references and notes</p>
            </div>
          ) : (
            filteredReferences.map((ref) => {
              const isExpanded = expandedId === ref.id;
              return (
                <div
                  key={ref.id}
                  className={cn(
                    'bg-muted/30 rounded-lg border border-border/50 overflow-hidden transition-all',
                    isExpanded && 'ring-1 ring-primary/30'
                  )}
                >
                  <div 
                    className="p-3 cursor-pointer flex items-start gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : ref.id)}
                  >
                    <div 
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getSubjectColor(ref.subject) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{ref.title}</span>
                        {ref.pages && (
                          <span className="text-xs text-muted-foreground">pp. {ref.pages}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ref.subject}</span>
                        {ref.author && <span>• {ref.author}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-border/30">
                      {ref.notes ? (
                        <div className="bg-background/50 rounded-md p-3 mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                          <p className="text-sm whitespace-pre-wrap">{ref.notes}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic mt-3">No notes added</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Added {format(parseISO(ref.createdAt), 'MMM d, yyyy')}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteReference(ref.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}