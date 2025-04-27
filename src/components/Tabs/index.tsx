"use client";

import { startTransition, useState } from "react";
import { unstable_Activity as Activity } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [oldActiveTab, setOldActiveTab] = useState(defaultTab || tabs[0].id);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const isOldTabToTheLeft = (() => {
    const oldIndex = tabs.findIndex((tab) => tab.id === oldActiveTab);
    const newIndex = tabs.findIndex((tab) => tab.id === activeTab);

    return oldIndex < newIndex;
  })();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="border-b border-gray-700">
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                startTransition(() => {
                  setOldActiveTab(activeTab);
                  setActiveTab(tab.id);
                });
              }}
              className={`relative px-4 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <ViewTransition
                  default={
                    isOldTabToTheLeft
                      ? "tab-transition-right"
                      : "tab-transition-left"
                  }
                >
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500" />
                </ViewTransition>
              )}
            </button>
          ))}
        </nav>
      </div>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <ViewTransition key={tab.id}>
            <Activity mode={isActive ? "visible" : "hidden"}>
              {tab.content}
            </Activity>
          </ViewTransition>
        );
      })}
    </div>
  );
}
