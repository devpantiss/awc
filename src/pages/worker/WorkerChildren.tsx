import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Eye, Filter, Plus, Search, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { AddChildModal } from './AddChildModal';
import { getNutritionTone, managedChildren } from '../../data/childMonitoringData';
import type { ManagedChild } from '../../data/childMonitoringData';
import { cn } from '../../utils';

export function WorkerChildren() {
  const navigate = useNavigate();
  const [children, setChildren] = useState<ManagedChild[]>(managedChildren);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Normal' | 'Moderate' | 'Severe'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<ManagedChild | null>(null);

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesSearch =
        child.name.toLowerCase().includes(search.toLowerCase()) ||
        child.parentName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || child.nutritionStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [children, filter, search]);

  const handleUpsertChild = (nextChild: ManagedChild) => {
    setChildren((current) => {
      const exists = current.some((child) => child.id === nextChild.id);
      if (!exists) return [nextChild, ...current];
      return current.map((child) => (child.id === nextChild.id ? nextChild : child));
    });
    setEditingChild(null);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-sky-100 p-3 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                <Users size={22} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Children</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search, filter, and update child records from one place.
                </p>
              </div>
            </div>
          </div>
          <Button
            className="rounded-2xl px-5 py-3 text-sm font-semibold"
            onClick={() => {
              setEditingChild(null);
              setModalOpen(true);
            }}
          >
            <Plus size={16} />
            Add Child
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 rounded-2xl pl-11"
            placeholder="Search by child or parent name"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={filter} onValueChange={(value: 'all' | 'Normal' | 'Moderate' | 'Severe') => setFilter(value)}>
            <SelectTrigger className="h-12 w-[180px] border-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nutrition Status</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm">
          Showing {filteredChildren.length} of {children.length} children
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-4 shadow-sm md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Child Name</TableHead>
              <TableHead className="px-4">Age</TableHead>
              <TableHead className="px-4">Gender</TableHead>
              <TableHead className="px-4">Parent Name</TableHead>
              <TableHead className="px-4">Nutrition Status</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChildren.map((child) => {
              const tone = getNutritionTone(child.nutritionStatus);

              return (
                <TableRow key={child.id}>
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{child.name}</p>
                      <p className="text-xs text-muted-foreground">{child.phoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground">{child.ageLabel}</TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground">{child.gender}</TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground">{child.parentName}</TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge
                      className={cn(
                        'rounded-full px-3 py-1',
                        tone === 'emerald' && 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
                        tone === 'amber' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
                        tone === 'red' && 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
                      )}
                      variant="outline"
                    >
                      {child.nutritionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate(`/worker/child/${child.id}`)}
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                          setEditingChild(child);
                          setModalOpen(true);
                        }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <AddChildModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingChild(null);
        }}
        onSubmit={handleUpsertChild}
        initialChild={editingChild}
      />
    </div>
  );
}
