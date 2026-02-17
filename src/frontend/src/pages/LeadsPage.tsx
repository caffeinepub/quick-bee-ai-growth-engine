import { useState, useMemo } from 'react';
import { useGetLeadsPaginated } from '../hooks/useLeads';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { AddLeadDialog } from '../components/leads/AddLeadDialog';
import { LeadCard } from '../components/common/LeadCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ServiceNiche3dIcon } from '../components/common/ServiceNiche3dIcon';
import type { Lead } from '../backend';

const ITEMS_PER_PAGE = 20;

export default function LeadsPage() {
  const [offset, setOffset] = useState(0);
  const { data: leads = [], isLoading } = useGetLeadsPaginated(offset, ITEMS_PER_PAGE);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nicheFilter, setNicheFilter] = useState<string>('all');
  
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const uniqueNiches = useMemo(() => {
    const niches = new Set(leads.map(lead => lead.niche).filter(n => n && n !== 'default'));
    return Array.from(niches).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !debouncedSearch || 
        lead.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.niche.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesNiche = nicheFilter === 'all' || lead.niche === nicheFilter;
      
      return matchesSearch && matchesStatus && matchesNiche;
    });
  }, [leads, debouncedSearch, statusFilter, nicheFilter]);

  const handleLoadMore = () => {
    setOffset(prev => prev + ITEMS_PER_PAGE);
  };

  if (isLoading && offset === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage your lead pipeline</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {leads.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, city, or niche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Select value={nicheFilter} onValueChange={setNicheFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              {nicheFilter !== 'all' && (
                <ServiceNiche3dIcon
                  variant="niche"
                  niche={nicheFilter}
                  size={16}
                  className="mr-2 rounded"
                />
              )}
              <SelectValue placeholder="Niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Niches</SelectItem>
              {uniqueNiches.map(niche => (
                <SelectItem key={niche} value={niche}>
                  <div className="flex items-center gap-2">
                    <ServiceNiche3dIcon
                      variant="niche"
                      niche={niche}
                      size={16}
                      className="rounded"
                    />
                    {niche}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No leads yet. Add your first lead to get started.</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </CardContent>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No leads match your filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map(lead => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
          
          {leads.length >= ITEMS_PER_PAGE && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      <AddLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
