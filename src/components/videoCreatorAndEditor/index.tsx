"use client";

import { useQueryState } from "nuqs";

import { api } from "@/trpc/react";

import { InterfaceIcons } from "../ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CaptionsPanel } from "./components/captions-panel";
import { FontStyles } from "./components/font-styles";
import { SettingsPanel } from "./components/settings-panel";
import { RemotionPlayer } from "./remotion";

export function VideoCreatorAndEditor() {
  const [fileId] = useQueryState("file");

  const { data, isLoading } = api.file.get.useQuery(
    {
      id: fileId ?? "",
    },
    {
      enabled: !!fileId,
    },
  );

  if (isLoading && fileId) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <InterfaceIcons.Loading className="size-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="relative flex h-full flex-col gap-2 p-4 lg:grid lg:grid-cols-3">
      <div className="flex items-start md:col-span-2 md:p-4">
        {!data && isLoading && (
          <div className="flex h-full min-h-96 flex-1 items-center justify-center border">
            <div className="text-center">
              <h3 className="text-lg font-medium">No file selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select a file to edit. Or upload a new file.
              </p>
            </div>
          </div>
        )}
        {data && (
          <div className="flex h-full max-h-screen min-h-96 flex-1 flex-col items-center justify-center border">
            <RemotionPlayer src={data.url} />
          </div>
        )}
      </div>

      <div className="max-h-[calc(100vh-6rem)] overflow-y-auto border bg-background p-4 md:col-start-1 md:row-start-1">
        <Tabs defaultValue="captions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="captions">Captions</TabsTrigger>
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="captions">
            <CaptionsPanel />
          </TabsContent>
          <TabsContent value="font">
            <FontStyles />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
