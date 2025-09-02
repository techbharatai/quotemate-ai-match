// contexts/ProjectContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  projectId: string;
  projectData: any;
  setProjectInfo: (info: any) => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectId, setProjectId] = useState('');
  const [projectData, setProjectData] = useState(null);

  const setProjectInfo = (info: any) => {
    setProjectId(info.projectId || '');
    setProjectData(info.projectData || null);
  };

  const clearProject = () => {
    setProjectId('');
    setProjectData(null);
  };

  return (
    <ProjectContext.Provider value={{
      projectId,
      projectData,
      setProjectInfo,
      clearProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
