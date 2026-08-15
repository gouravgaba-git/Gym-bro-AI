import React from "react";
import PageHeader from "../components/common/PageHeader";
import SettingsCard from "../components/profile/SettingsCard";

const SettingsPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8 animate-in fade-in duration-200">
      <PageHeader
        title="Settings"
        description="Manage your appearance, measurement units, and notification preferences."
      />

      <SettingsCard />
    </div>
  );
};

export default SettingsPage;
