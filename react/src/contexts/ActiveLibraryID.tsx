import React, { createContext, useState } from 'react';

const ActiveLibraryID = createContext<string | null>(null);

export const SetActiveLibraryID = createContext<
  React.Dispatch<React.SetStateAction<string | null>>
>(null as unknown as React.Dispatch<React.SetStateAction<string | null>>);

export const ActiveLibraryIDProvider = ({ children }: any) => {
  const { localStorage } = window;

  const previousLibraryID = localStorage.getItem('activeLibrary');

  const [activeLibraryID, setActiveLibraryID] = useState<string | null>(
    previousLibraryID || 'bsclibrary'
  );

  if (activeLibraryID) localStorage.setItem('activeLibrary', activeLibraryID);

  return (
    <ActiveLibraryID.Provider value={activeLibraryID}>
      <SetActiveLibraryID.Provider value={setActiveLibraryID}>
        {children}
      </SetActiveLibraryID.Provider>
    </ActiveLibraryID.Provider>
  );
};

export default ActiveLibraryID;
