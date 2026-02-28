import React, { createContext, useContext, useEffect, useState } from 'react';
import { Site, Worklog } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { TEST_SITES, TEST_WORKLOGS } from './test-data';

interface AppState {
  sites: Site[];
  worklogs: Worklog[];
}

interface AppContextType extends AppState {
  addSite: (site: Omit<Site, 'id'>) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  saveWorklog: (worklog: Omit<Worklog, 'id' | 'updatedAt' | 'version'> & { id?: string }) => void;
  deleteWorklog: (id: string) => void;
  getWorklogsBySite: (siteId: string) => Worklog[];
  getWorklogByDate: (siteId: string, date: string) => Worklog | undefined;
  getWorklogById: (id: string) => Worklog | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'inopnc_app_data_v1';

const INITIAL_SITES: Site[] = TEST_SITES;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    return { sites: INITIAL_SITES, worklogs: TEST_WORKLOGS };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addSite = (site: Omit<Site, 'id'>) => {
    const newSite = { ...site, id: uuidv4() };
    setState(prev => ({ ...prev, sites: [newSite, ...prev.sites] }));
  };

  const updateSite = (id: string, updates: Partial<Site>) => {
    setState(prev => ({
      ...prev,
      sites: prev.sites.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const deleteSite = (id: string) => {
    setState(prev => ({
      ...prev,
      sites: prev.sites.filter(s => s.id !== id),
      worklogs: prev.worklogs.filter(w => w.siteId !== id)
    }));
  };

  const saveWorklog = (worklogData: Omit<Worklog, 'id' | 'updatedAt' | 'version'> & { id?: string }) => {
    setState(prev => {
      const existingIndex = prev.worklogs.findIndex(w => 
        w.id === worklogData.id || (w.siteId === worklogData.siteId && w.date === worklogData.date)
      );

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        // Update
        const existing = prev.worklogs[existingIndex];
        const updated: Worklog = {
          ...existing,
          ...worklogData,
          id: existing.id, // Ensure ID is preserved
          updatedAt: now,
          version: existing.version + 1
        };
        const newWorklogs = [...prev.worklogs];
        newWorklogs[existingIndex] = updated;
        return { ...prev, worklogs: newWorklogs };
      } else {
        // Create
        const newLog: Worklog = {
          ...worklogData,
          id: uuidv4(),
          updatedAt: now,
          version: 1,
          status: worklogData.status || 'draft'
        };
        return { ...prev, worklogs: [...prev.worklogs, newLog] };
      }
    });
  };

  const deleteWorklog = (id: string) => {
    setState(prev => ({
      ...prev,
      worklogs: prev.worklogs.filter(w => w.id !== id)
    }));
  };

  const getWorklogsBySite = (siteId: string) => {
    return state.worklogs.filter(w => w.siteId === siteId).sort((a, b) => b.date.localeCompare(a.date));
  };

  const getWorklogByDate = (siteId: string, date: string) => {
    return state.worklogs.find(w => w.siteId === siteId && w.date === date);
  };

  const getWorklogById = (id: string) => {
    return state.worklogs.find(w => w.id === id);
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      addSite, 
      updateSite, 
      deleteSite, 
      saveWorklog, 
      deleteWorklog,
      getWorklogsBySite,
      getWorklogByDate,
      getWorklogById
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
