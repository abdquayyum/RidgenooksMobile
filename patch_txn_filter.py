import sys

with open('src/app/transactions.tsx', 'r') as f:
    content = f.read()

old_filter = """  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = 
        String(txn.id).toLowerCase().includes(searchQuery.toLowerCase()) || 
        (getTxnProperty(txn.property_id)?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(txn.amount).includes(searchQuery);
        
      const matchesFilter = activeFilter === 'All' || txn.status?.toLowerCase() === activeFilter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, activeFilter]);"""

new_filter = """  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(txn => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch = 
        String(txn.ref || txn.id || '').toLowerCase().includes(q) || 
        String(txn.property_title || '').toLowerCase().includes(q) ||
        String(txn.amount || '').includes(q);
        
      const matchesFilter = activeFilter === 'All' || (txn.status || '').toLowerCase() === (activeFilter || '').toLowerCase();
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [transactions, searchQuery, activeFilter]);"""

if old_filter in content:
    content = content.replace(old_filter, new_filter)
    with open('src/app/transactions.tsx', 'w') as f:
        f.write(content)
    print("Filter patched successfully!")
else:
    print("Could not find old filter.")

