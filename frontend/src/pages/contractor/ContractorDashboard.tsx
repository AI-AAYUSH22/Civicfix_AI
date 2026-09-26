import React from 'react';
import { ContractorLayout } from '@/layouts/ContractorLayout';
import { ContractorHome } from '@/pages/contractor/ContractorHome';
import { useApp } from '@/context/AppContext';

export const ContractorDashboard: React.FC = () => {
  const { currentUser } = useApp();
  const defaultWard = currentUser?.assigned_ward?.ward_id || 'all';
  const [contractorFilter, setContractorFilter] = React.useState<string>('all');
  const [selectedWard, setSelectedWard] = React.useState<string>(defaultWard);

  React.useEffect(() => {
    if (currentUser?.assigned_ward?.ward_id) {
      setSelectedWard(currentUser.assigned_ward.ward_id);
    }
  }, [currentUser]);

  return (
    <ContractorLayout
      assignedCount={4}
      activeFilter={contractorFilter}
      onFilterChange={setContractorFilter}
      selectedWard={selectedWard}
      onWardChange={setSelectedWard}
      onOpenQuickCapture={() => alert('Launching Quick Camera Capture for active job')}
    >
      <ContractorHome
        filter={contractorFilter}
        wardFilter={selectedWard}
        onWardChange={setSelectedWard}
      />
    </ContractorLayout>
  );
};

