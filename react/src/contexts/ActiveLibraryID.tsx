import React, { createContext, useState } from 'react';

const ActiveLibraryID = createContext<string>(null as any);

const SetActiveLibraryID = createContext<
  React.Dispatch<React.SetStateAction<string>>
>(null as unknown as React.Dispatch<React.SetStateAction<string>>);

export const ActiveLibraryIDProvider = ({ children }: any) => {
  const { localStorage } = window;

  const previousLibraryID = localStorage.getItem('activeLibrary');

  const [activeLibraryID, setActiveLibraryID] = useState<string>(
    previousLibraryID || ''
  );

  return (
    <ActiveLibraryID.Provider value={activeLibraryID}>
      <SetActiveLibraryID.Provider value={setActiveLibraryID}>
        {children}
      </SetActiveLibraryID.Provider>
    </ActiveLibraryID.Provider>
  );
};

export default ActiveLibraryID;
