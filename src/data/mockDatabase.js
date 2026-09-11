export const initialData = {
  user: {
    email: 'operator@hospohub.nz',
    name: 'Sarah\'s Cafe Ltd',
  },
  applications: [
    {
      id: 'HH-2026-00125',
      type: 'Food Business Registration',
      status: 'Under Review',
      submittedDate: '10 September 2026',
      assignedTeam: 'Food Safety Team',
      lastUpdate: '15 September 2026',
      nextStep: 'Council review in progress'
    },
    {
      id: 'HH-2026-00148',
      type: 'Alcohol Licence',
      status: 'Action Required',
      submittedDate: '15 September 2026',
      assignedTeam: 'Alcohol Licensing Team',
      lastUpdate: '18 September 2026',
      nextStep: 'Provide updated site plan'
    },
    {
      id: 'HH-2024-00286',
      type: 'Outdoor Dining Approval',
      status: 'Approved',
      submittedDate: '1 September 2024',
      assignedTeam: 'Public Space Team',
      lastUpdate: '5 September 2024',
      nextStep: 'None'
    }
  ],
  documents: [
    {
      id: 1,
      name: 'Food Control Plan',
      type: 'Supporting',
      expiryDate: '-',
      status: 'Uploaded'
    },
    {
      id: 2,
      name: 'Food registration certificate',
      type: 'Licence',
      expiryDate: '20 Mar 2027',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Insurance certificate',
      type: 'Supporting',
      expiryDate: '10 Jan 2027',
      status: 'Expiring Soon'
    },
    {
      id: 4,
      name: 'Alcohol licence',
      type: 'Licence',
      expiryDate: '15 May 2027',
      status: 'Active'
    }
  ],
  messages: [
    {
      id: 1,
      from: 'Council Licensing Team',
      subject: 'Additional information required for your application.',
      date: '18 Sep 2026',
      read: false,
    }
  ],
  training: [
    {
      id: 1,
      name: 'Food Safety Training',
      progress: 40,
      completed: false
    },
    {
      id: 2,
      name: 'Host Responsibility Training',
      progress: 100,
      completed: true
    }
  ]
};

