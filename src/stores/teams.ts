import { TeamSchemaValues } from "@/schemas/team-schema";
import { create } from "zustand";

interface TeamState {
  teams: TeamSchemaValues[];
}

interface TeamStore extends TeamState {
  addTeam: (team: TeamSchemaValues) => void;
  removeTeam: (teamId: string) => void;
  updateTeamName: (teamId: string, name: string) => void;
  updateTeamUrl: (teamId: string, url: string) => void;
}

const defaultValues = {
  teams: [],
};

export const useTeamStore = create<TeamStore>()((set) => ({
  ...defaultValues,
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  removeTeam: (teamId) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== teamId),
    })),
  updateTeamName: (teamId, name) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId ? { ...team, name } : team,
      ),
    })),
  updateTeamUrl: (teamId, url) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId ? { ...team, url } : team,
      ),
    })),
}));
