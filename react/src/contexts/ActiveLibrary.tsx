import React, { createContext, useState } from 'react';

const ActiveLibrary = createContext<string | null>(null);

const SetActiveLibrary = createContext<
  React.Dispatch<React.SetStateAction<string | null>>
>(null as unknown as React.Dispatch<React.SetStateAction<string | null>>);

export const NotificationProvider = ({ children }: any) => {
  const [activeLibrary, setActiveLibrary] = useState<string | null>(null);

  return (
    <ActiveLibrary.Provider value={activeLibrary}>
      <SetActiveLibrary.Provider value={setActiveLibrary}>
        {children}
      </SetActiveLibrary.Provider>
    </ActiveLibrary.Provider>
  );
};

export default ActiveLibrary;
